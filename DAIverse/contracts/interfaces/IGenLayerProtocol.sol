// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IGenLayerProtocol
 * @dev Interface for GenLayer Protocol SDK integration
 * This interface defines the methods that the GenLayer Protocol SDK should implement
 * for prediction market functionality
 */
interface IGenLayerProtocol {
    /**
     * @dev Register a new prediction market
     * @param marketId ID of the market
     * @param title Market title
     * @param description Market description
     */
    function registerPredictionMarket(uint256 marketId, string memory title, string memory description) external;

    /**
     * @dev Record a bet on a prediction market
     * @param marketId ID of the market
     * @param user Address of the user placing the bet
     * @param outcome The outcome being bet on
     * @param amount Amount of tokens bet
     */
    function recordPredictionBet(uint256 marketId, address user, string memory outcome, uint256 amount) external;

    /**
     * @dev Resolve a prediction market with the final outcome
     * @param marketId ID of the market
     * @param outcome The winning outcome
     */
    function resolvePredictionMarket(uint256 marketId, string memory outcome) external;

    /**
     * @dev Close a prediction market before expiration
     * @param marketId ID of the market
     */
    function closePredictionMarket(uint256 marketId) external;

    /**
     * @dev Record a winnings claim from a resolved market
     * @param marketId ID of the market
     * @param user Address of the user claiming winnings
     * @param amount Amount of tokens claimed
     */
    function recordWinningsClaim(uint256 marketId, address user, uint256 amount) external;
}