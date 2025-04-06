// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DAIToken
 * @dev ERC20 token for the DAIverse platform
 * Used to reward users for completing modules and contributing content
 */
contract DAIToken is ERC20, Ownable {
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    // Constructor
    constructor() ERC20("DAIverse Token", "DAI") Ownable() {
        // Mint initial supply to contract creator
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mint tokens to a user's address
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting tokens (e.g., "module_completion", "contribution")
     */
    function mintTokens(address to, uint256 amount, string memory reason) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Burn tokens from a user's address
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     * @param reason Reason for burning tokens
     */
    function burnTokens(address from, uint256 amount, string memory reason) external {
        require(msg.sender == from || msg.sender == owner(), "Not authorized");
        _burn(from, amount);
        emit TokensBurned(from, amount, reason);
    }
}