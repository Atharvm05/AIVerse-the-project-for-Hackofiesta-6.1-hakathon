// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DAIToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IGenLayerProtocol.sol";

/**
 * @title DAIPredictionMarket
 * @dev Contract for managing prediction markets on the DAIverse platform
 * Integrated with GenLayer Protocol SDK for enhanced functionality
 */
contract DAIPredictionMarket is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _marketIds;

    // Reference to DAIToken contract
    DAIToken public daiToken;
    
    // Reference to GenLayer Protocol
    IGenLayerProtocol public genLayerProtocol;

    // Market status
    enum MarketStatus { OPEN, CLOSED, RESOLVED }

    // Market category
    enum MarketCategory { SPORTS, SCIENCE, CRYPTO, POLITICS, ENTERTAINMENT, OTHER }

    // Market struct
    struct Market {
        uint256 id;
        string title;
        string description;
        MarketCategory category;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
        MarketStatus status;
        string[] outcomes;
        mapping(string => uint256) totalBets; // Total amount bet on each outcome
        mapping(address => mapping(string => uint256)) userBets; // User bets on each outcome
        string resolvedOutcome;
        uint256 totalLiquidity;
        uint256 creatorFee; // Fee percentage (in basis points, e.g., 100 = 1%)
    }

    // Mappings
    mapping(uint256 => Market) public markets;
    mapping(address => uint256[]) public userCreatedMarkets;
    mapping(address => uint256[]) public userParticipatedMarkets;

    // Events
    event MarketCreated(uint256 indexed marketId, address indexed creator, string title);
    event BetPlaced(address indexed user, uint256 indexed marketId, string outcome, uint256 amount);
    event MarketResolved(uint256 indexed marketId, string outcome);
    event WinningsClaimed(address indexed user, uint256 indexed marketId, uint256 amount);

    // Constructor
    constructor(address _tokenAddress, address _genLayerProtocolAddress) Ownable() {
        daiToken = DAIToken(_tokenAddress);
        genLayerProtocol = IGenLayerProtocol(_genLayerProtocolAddress);
    }

    /**
     * @dev Create a new prediction market
     * @param title Market title
     * @param description Market description
     * @param category Market category
     * @param outcomes Possible outcomes for the market
     * @param expiresAt Timestamp when the market expires
     * @param creatorFee Fee percentage for the creator (in basis points)
     * @return marketId The ID of the newly created market
     */
    function createMarket(
        string memory title,
        string memory description,
        MarketCategory category,
        string[] memory outcomes,
        uint256 expiresAt,
        uint256 creatorFee
    ) external returns (uint256) {
        require(outcomes.length >= 2, "At least two outcomes required");
        require(expiresAt > block.timestamp, "Expiration must be in the future");
        require(creatorFee <= 500, "Creator fee cannot exceed 5%");

        _marketIds.increment();
        uint256 marketId = _marketIds.current();

        Market storage newMarket = markets[marketId];
        newMarket.id = marketId;
        newMarket.title = title;
        newMarket.description = description;
        newMarket.category = category;
        newMarket.creator = msg.sender;
        newMarket.createdAt = block.timestamp;
        newMarket.expiresAt = expiresAt;
        newMarket.status = MarketStatus.OPEN;
        newMarket.outcomes = outcomes;
        newMarket.creatorFee = creatorFee;

        userCreatedMarkets[msg.sender].push(marketId);

        // Register market with GenLayer Protocol
        genLayerProtocol.registerPredictionMarket(marketId, title, description);

        emit MarketCreated(marketId, msg.sender, title);
        return marketId;
    }

    /**
     * @dev Place a bet on a market outcome
     * @param marketId ID of the market
     * @param outcome The outcome to bet on
     * @param amount Amount of tokens to bet
     */
    function placeBet(uint256 marketId, string memory outcome, uint256 amount) external {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.OPEN, "Market is not open");
        require(block.timestamp < market.expiresAt, "Market has expired");
        require(isValidOutcome(marketId, outcome), "Invalid outcome");
        require(amount > 0, "Bet amount must be greater than zero");

        // Transfer tokens from user to contract
        daiToken.transferFrom(msg.sender, address(this), amount);

        // Update market data
        market.totalBets[outcome] += amount;
        market.userBets[msg.sender][outcome] += amount;
        market.totalLiquidity += amount;

        // Add to user participated markets if first bet
        if (!hasUserParticipated(msg.sender, marketId)) {
            userParticipatedMarkets[msg.sender].push(marketId);
        }

        // Record bet with GenLayer Protocol
        genLayerProtocol.recordPredictionBet(marketId, msg.sender, outcome, amount);

        emit BetPlaced(msg.sender, marketId, outcome, amount);
    }

    /**
     * @dev Resolve a market with the final outcome
     * @param marketId ID of the market
     * @param outcome The winning outcome
     */
    function resolveMarket(uint256 marketId, string memory outcome) external {
        Market storage market = markets[marketId];
        require(msg.sender == market.creator || msg.sender == owner(), "Not authorized");
        require(market.status == MarketStatus.OPEN, "Market is not open");
        require(isValidOutcome(marketId, outcome), "Invalid outcome");

        market.status = MarketStatus.RESOLVED;
        market.resolvedOutcome = outcome;

        // Notify GenLayer Protocol about resolution
        genLayerProtocol.resolvePredictionMarket(marketId, outcome);

        emit MarketResolved(marketId, outcome);
    }

    /**
     * @dev Claim winnings from a resolved market
     * @param marketId ID of the market
     */
    function claimWinnings(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.RESOLVED, "Market not resolved");

        string memory winningOutcome = market.resolvedOutcome;
        uint256 userBet = market.userBets[msg.sender][winningOutcome];
        require(userBet > 0, "No winning bets");

        // Calculate winnings
        uint256 totalWinningBets = market.totalBets[winningOutcome];
        uint256 winnings = (userBet * market.totalLiquidity) / totalWinningBets;

        // Apply creator fee
        uint256 fee = (winnings * market.creatorFee) / 10000;
        uint256 netWinnings = winnings - fee;

        // Reset user bet to prevent double claiming
        market.userBets[msg.sender][winningOutcome] = 0;

        // Transfer winnings to user and fee to creator
        daiToken.transfer(msg.sender, netWinnings);
        daiToken.transfer(market.creator, fee);

        // Record claim with GenLayer Protocol
        genLayerProtocol.recordWinningsClaim(marketId, msg.sender, netWinnings);

        emit WinningsClaimed(msg.sender, marketId, netWinnings);
    }

    /**
     * @dev Close a market before expiration (only creator or owner)
     * @param marketId ID of the market
     */
    function closeMarket(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(msg.sender == market.creator || msg.sender == owner(), "Not authorized");
        require(market.status == MarketStatus.OPEN, "Market is not open");

        market.status = MarketStatus.CLOSED;

        // Notify GenLayer Protocol
        genLayerProtocol.closePredictionMarket(marketId);
    }

    /**
     * @dev Get market details
     * @param marketId ID of the market
     * @return title Market title
     * @return description Market description
     * @return category Market category
     * @return creator Market creator address
     * @return createdAt Creation timestamp
     * @return expiresAt Expiration timestamp
     * @return status Market status
     * @return outcomes Possible outcomes
     * @return resolvedOutcome Resolved outcome (if resolved)
     * @return totalLiquidity Total liquidity in the market
     */
    function getMarketDetails(uint256 marketId) external view returns (
        string memory title,
        string memory description,
        MarketCategory category,
        address creator,
        uint256 createdAt,
        uint256 expiresAt,
        MarketStatus status,
        string[] memory outcomes,
        string memory resolvedOutcome,
        uint256 totalLiquidity
    ) {
        Market storage market = markets[marketId];
        return (
            market.title,
            market.description,
            market.category,
            market.creator,
            market.createdAt,
            market.expiresAt,
            market.status,
            market.outcomes,
            market.resolvedOutcome,
            market.totalLiquidity
        );
    }

    /**
     * @dev Get total amount bet on an outcome
     * @param marketId ID of the market
     * @param outcome The outcome
     * @return Total amount bet on the outcome
     */
    function getTotalBetForOutcome(uint256 marketId, string memory outcome) external view returns (uint256) {
        return markets[marketId].totalBets[outcome];
    }

    /**
     * @dev Get user bet on an outcome
     * @param marketId ID of the market
     * @param user User address
     * @param outcome The outcome
     * @return User's bet amount on the outcome
     */
    function getUserBetForOutcome(uint256 marketId, address user, string memory outcome) external view returns (uint256) {
        return markets[marketId].userBets[user][outcome];
    }

    /**
     * @dev Get markets created by a user
     * @param user User address
     * @return Array of market IDs created by the user
     */
    function getMarketsByCreator(address user) external view returns (uint256[] memory) {
        return userCreatedMarkets[user];
    }

    /**
     * @dev Get markets in which a user has participated
     * @param user User address
     * @return Array of market IDs in which the user has participated
     */
    function getMarketsByParticipant(address user) external view returns (uint256[] memory) {
        return userParticipatedMarkets[user];
    }

    /**
     * @dev Check if an outcome is valid for a market
     * @param marketId ID of the market
     * @param outcome The outcome to check
     * @return True if the outcome is valid, false otherwise
     */
    function isValidOutcome(uint256 marketId, string memory outcome) public view returns (bool) {
        string[] memory marketOutcomes = markets[marketId].outcomes;
        for (uint256 i = 0; i < marketOutcomes.length; i++) {
            if (keccak256(bytes(marketOutcomes[i])) == keccak256(bytes(outcome))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Check if a user has participated in a market
     * @param user User address
     * @param marketId ID of the market
     * @return True if the user has participated, false otherwise
     */
    function hasUserParticipated(address user, uint256 marketId) internal view returns (bool) {
        uint256[] memory participatedMarkets = userParticipatedMarkets[user];
        for (uint256 i = 0; i < participatedMarkets.length; i++) {
            if (participatedMarkets[i] == marketId) {
                return true;
            }
        }
        return false;
    }
}