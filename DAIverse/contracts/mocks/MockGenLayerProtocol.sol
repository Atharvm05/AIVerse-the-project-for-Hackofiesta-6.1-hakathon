// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IGenLayerProtocol.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockGenLayerProtocol
 * @dev Mock implementation of the GenLayer Protocol for testing purposes
 */
contract MockGenLayerProtocol is IGenLayerProtocol, Ownable {
    // Events to track function calls
    event PredictionMarketRegistered(uint256 indexed marketId, string title, string description);
    event PredictionBetRecorded(uint256 indexed marketId, address indexed user, string outcome, uint256 amount);
    event PredictionMarketResolved(uint256 indexed marketId, string outcome);
    event PredictionMarketClosed(uint256 indexed marketId);
    event WinningsClaimRecorded(uint256 indexed marketId, address indexed user, uint256 amount);

    // Market data structures
    struct MarketData {
        string title;
        string description;
        bool exists;
        bool resolved;
        string resolvedOutcome;
    }

    // Mappings
    mapping(uint256 => MarketData) public markets;
    mapping(uint256 => mapping(address => mapping(string => uint256))) public bets;

    /**
     * @dev Register a new prediction market
     * @param marketId ID of the market
     * @param title Market title
     * @param description Market description
     */
    function registerPredictionMarket(uint256 marketId, string memory title, string memory description) external override {
        markets[marketId] = MarketData({
            title: title,
            description: description,
            exists: true,
            resolved: false,
            resolvedOutcome: ""
        });

        emit PredictionMarketRegistered(marketId, title, description);
    }

    /**
     * @dev Record a bet on a prediction market
     * @param marketId ID of the market
     * @param user Address of the user placing the bet
     * @param outcome The outcome being bet on
     * @param amount Amount of tokens bet
     */
    function recordPredictionBet(uint256 marketId, address user, string memory outcome, uint256 amount) external override {
        require(markets[marketId].exists, "Market does not exist");
        require(!markets[marketId].resolved, "Market already resolved");

        bets[marketId][user][outcome] += amount;

        emit PredictionBetRecorded(marketId, user, outcome, amount);
    }

    /**
     * @dev Resolve a prediction market with the final outcome
     * @param marketId ID of the market
     * @param outcome The winning outcome
     */
    function resolvePredictionMarket(uint256 marketId, string memory outcome) external override {
        require(markets[marketId].exists, "Market does not exist");
        require(!markets[marketId].resolved, "Market already resolved");

        markets[marketId].resolved = true;
        markets[marketId].resolvedOutcome = outcome;

        emit PredictionMarketResolved(marketId, outcome);
    }

    /**
     * @dev Close a prediction market before expiration
     * @param marketId ID of the market
     */
    function closePredictionMarket(uint256 marketId) external override {
        require(markets[marketId].exists, "Market does not exist");
        require(!markets[marketId].resolved, "Market already resolved");

        emit PredictionMarketClosed(marketId);
    }

    /**
     * @dev Record a winnings claim from a resolved market
     * @param marketId ID of the market
     * @param user Address of the user claiming winnings
     * @param amount Amount of tokens claimed
     */
    function recordWinningsClaim(uint256 marketId, address user, uint256 amount) external override {
        require(markets[marketId].exists, "Market does not exist");
        require(markets[marketId].resolved, "Market not resolved");

        emit WinningsClaimRecorded(marketId, user, amount);
    }

    /**
     * @dev Get market details
     * @param marketId ID of the market
     * @return title Market title
     * @return description Market description
     * @return exists Whether the market exists
     * @return resolved Whether the market is resolved
     * @return resolvedOutcome The resolved outcome (if resolved)
     */
    function getMarketDetails(uint256 marketId) external view returns (
        string memory title,
        string memory description,
        bool exists,
        bool resolved,
        string memory resolvedOutcome
    ) {
        MarketData memory market = markets[marketId];
        return (
            market.title,
            market.description,
            market.exists,
            market.resolved,
            market.resolvedOutcome
        );
    }

    /**
     * @dev Get user bet on an outcome
     * @param marketId ID of the market
     * @param user User address
     * @param outcome The outcome
     * @return User's bet amount on the outcome
     */
    function getUserBet(uint256 marketId, address user, string memory outcome) external view returns (uint256) {
        return bets[marketId][user][outcome];
    }
}