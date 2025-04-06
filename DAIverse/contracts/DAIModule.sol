// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DAIToken.sol";
import "./DAIBadge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DAIModule
 * @dev Contract for managing learning modules on the DAIverse platform
 */
contract DAIModule is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _moduleIds;

    // References to other contracts
    DAIToken public daiToken;
    DAIBadge public daiBadge;

    // Module status
    enum ModuleStatus { PENDING, APPROVED, REJECTED }

    // Module difficulty
    enum ModuleDifficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    // Module struct
    struct Module {
        uint256 id;
        string title;
        string description;
        string category;
        ModuleDifficulty difficulty;
        address author;
        uint256 xpReward;
        uint256 tokenReward;
        string contentURI; // IPFS URI for module content
        uint256 createdAt;
        ModuleStatus status;
        uint256 upvotes;
    }

    // Completion struct
    struct Completion {
        address user;
        uint256 moduleId;
        uint256 score;
        uint256 completedAt;
        bool badgeIssued;
    }

    // Mappings
    mapping(uint256 => Module) public modules;
    mapping(address => mapping(uint256 => Completion)) public completions;
    mapping(address => uint256[]) public userCompletedModules;
    mapping(address => uint256[]) public userContributedModules;
    mapping(address => uint256) public userXP;

    // Events
    event ModuleCreated(uint256 indexed moduleId, address indexed author, string title);
    event ModuleStatusChanged(uint256 indexed moduleId, ModuleStatus status);
    event ModuleCompleted(address indexed user, uint256 indexed moduleId, uint256 score);
    event ModuleUpvoted(address indexed user, uint256 indexed moduleId);

    // Constructor
    constructor(address _tokenAddress, address _badgeAddress) Ownable() {
        daiToken = DAIToken(_tokenAddress);
        daiBadge = DAIBadge(_badgeAddress);
    }

    /**
     * @dev Create a new learning module
     * @param title Module title
     * @param description Module description
     * @param category Module category
     * @param difficulty Module difficulty
     * @param xpReward XP reward for completing the module
     * @param tokenReward Token reward for completing the module
     * @param contentURI IPFS URI for module content
     * @return moduleId The ID of the newly created module
     */
    function createModule(
        string memory title,
        string memory description,
        string memory category,
        ModuleDifficulty difficulty,
        uint256 xpReward,
        uint256 tokenReward,
        string memory contentURI
    ) external returns (uint256) {
        _moduleIds.increment();
        uint256 moduleId = _moduleIds.current();

        modules[moduleId] = Module({
            id: moduleId,
            title: title,
            description: description,
            category: category,
            difficulty: difficulty,
            author: msg.sender,
            xpReward: xpReward,
            tokenReward: tokenReward,
            contentURI: contentURI,
            createdAt: block.timestamp,
            status: ModuleStatus.PENDING,
            upvotes: 0
        });

        userContributedModules[msg.sender].push(moduleId);

        emit ModuleCreated(moduleId, msg.sender, title);

        return moduleId;
    }

    /**
     * @dev Change the status of a module (admin only)
     * @param moduleId Module ID
     * @param status New status
     */
    function changeModuleStatus(uint256 moduleId, ModuleStatus status) external onlyOwner {
        require(moduleId <= _moduleIds.current(), "Module does not exist");
        modules[moduleId].status = status;

        // If module is approved, reward the author
        if (status == ModuleStatus.APPROVED) {
            address author = modules[moduleId].author;
            // Reward tokens based on difficulty
            uint256 contributionReward = 0;
            if (modules[moduleId].difficulty == ModuleDifficulty.BEGINNER) {
                contributionReward = 50 * 10 ** 18; // 50 tokens
            } else if (modules[moduleId].difficulty == ModuleDifficulty.INTERMEDIATE) {
                contributionReward = 100 * 10 ** 18; // 100 tokens
            } else {
                contributionReward = 150 * 10 ** 18; // 150 tokens
            }

            daiToken.mintTokens(author, contributionReward, "module_contribution");

            // Issue contribution badge
            string memory badgeURI = string(abi.encodePacked("ipfs://", modules[moduleId].contentURI, "/badge"));
            daiBadge.issueBadge(
                author,
                "Knowledge Contributor",
                "Contributed a high-quality learning module",
                DAIBadge.BadgeType.CONTRIBUTION,
                badgeURI
            );
        }

        emit ModuleStatusChanged(moduleId, status);
    }

    /**
     * @dev Complete a module
     * @param moduleId Module ID
     * @param score Completion score (0-100)
     */
    function completeModule(uint256 moduleId, uint256 score) external {
        require(moduleId <= _moduleIds.current(), "Module does not exist");
        require(modules[moduleId].status == ModuleStatus.APPROVED, "Module not approved");
        require(score <= 100, "Score must be between 0 and 100");
        require(completions[msg.sender][moduleId].completedAt == 0, "Module already completed");

        // Record completion
        completions[msg.sender][moduleId] = Completion({
            user: msg.sender,
            moduleId: moduleId,
            score: score,
            completedAt: block.timestamp,
            badgeIssued: false
        });

        userCompletedModules[msg.sender].push(moduleId);

        // Calculate rewards based on score
        uint256 xpReward = (modules[moduleId].xpReward * score) / 100;
        uint256 tokenReward = (modules[moduleId].tokenReward * score) / 100;

        // Update user XP
        userXP[msg.sender] += xpReward;

        // Mint tokens to user
        daiToken.mintTokens(msg.sender, tokenReward * 10 ** 18, "module_completion");

        // Issue badge if score is high enough
        if (score >= 80) {
            string memory badgeURI = string(abi.encodePacked("ipfs://", modules[moduleId].contentURI, "/badge"));
            daiBadge.issueBadge(
                msg.sender,
                modules[moduleId].title,
                string(abi.encodePacked("Completed the ", modules[moduleId].title, " module")),
                DAIBadge.BadgeType.COMPLETION,
                badgeURI
            );
            completions[msg.sender][moduleId].badgeIssued = true;
        }

        emit ModuleCompleted(msg.sender, moduleId, score);
    }

    /**
     * @dev Upvote a module
     * @param moduleId Module ID
     */
    function upvoteModule(uint256 moduleId) external {
        require(moduleId <= _moduleIds.current(), "Module does not exist");
        require(modules[moduleId].status == ModuleStatus.APPROVED, "Module not approved");
        require(completions[msg.sender][moduleId].completedAt > 0, "Must complete module to upvote");

        modules[moduleId].upvotes += 1;

        // Reward author with tokens for upvotes
        address author = modules[moduleId].author;
        daiToken.mintTokens(author, 1 * 10 ** 18, "module_upvote"); // 1 token per upvote

        emit ModuleUpvoted(msg.sender, moduleId);
    }

    /**
     * @dev Get all modules
     * @return Array of all modules
     */
    function getAllModules() external view returns (Module[] memory) {
        uint256 moduleCount = _moduleIds.current();
        Module[] memory allModules = new Module[](moduleCount);

        for (uint256 i = 1; i <= moduleCount; i++) {
            allModules[i - 1] = modules[i];
        }

        return allModules;
    }

    /**
     * @dev Get modules by category
     * @param category Module category
     * @return Array of modules in the category
     */
    function getModulesByCategory(string memory category) external view returns (Module[] memory) {
        uint256 moduleCount = _moduleIds.current();
        uint256 categoryCount = 0;

        // Count modules in category
        for (uint256 i = 1; i <= moduleCount; i++) {
            if (keccak256(bytes(modules[i].category)) == keccak256(bytes(category))) {
                categoryCount++;
            }
        }

        // Create array of correct size
        Module[] memory categoryModules = new Module[](categoryCount);
        uint256 index = 0;

        // Fill array
        for (uint256 i = 1; i <= moduleCount; i++) {
            if (keccak256(bytes(modules[i].category)) == keccak256(bytes(category))) {
                categoryModules[index] = modules[i];
                index++;
            }
        }

        return categoryModules;
    }

    /**
     * @dev Get modules completed by a user
     * @param user User address
     * @return Array of module IDs completed by the user
     */
    function getCompletedModules(address user) external view returns (uint256[] memory) {
        return userCompletedModules[user];
    }

    /**
     * @dev Get modules contributed by a user
     * @param user User address
     * @return Array of module IDs contributed by the user
     */
    function getContributedModules(address user) external view returns (uint256[] memory) {
        return userContributedModules[user];
    }

    /**
     * @dev Get user XP
     * @param user User address
     * @return User's XP
     */
    function getUserXP(address user) external view returns (uint256) {
        return userXP[user];
    }
}