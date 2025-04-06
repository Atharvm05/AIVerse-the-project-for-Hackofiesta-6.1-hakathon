// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DAIBadge
 * @dev ERC721 token for DAIverse achievement badges
 * Used to reward users for completing modules and contributing content
 */
contract DAIBadge is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Badge types
    enum BadgeType { COMPLETION, CONTRIBUTION, SPECIAL }

    // Badge struct
    struct Badge {
        string name;
        string description;
        BadgeType badgeType;
        uint256 issuedAt;
    }

    // Mapping from token ID to Badge
    mapping(uint256 => Badge) public badges;

    // Events
    event BadgeIssued(address indexed to, uint256 tokenId, string name, BadgeType badgeType);

    // Constructor
    constructor() ERC721("DAIverse Badge", "DAIB") Ownable() {}

    // Override functions to resolve conflicts between ERC721URIStorage and ERC721Enumerable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Issue a new badge to a user
     * @param to Address to issue badge to
     * @param name Name of the badge
     * @param description Description of the badge
     * @param badgeType Type of badge (COMPLETION, CONTRIBUTION, SPECIAL)
     * @param tokenURI URI for badge metadata (IPFS URI)
     * @return tokenId The ID of the newly minted badge
     */
    function issueBadge(
        address to,
        string memory name,
        string memory description,
        BadgeType badgeType,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        badges[tokenId] = Badge({
            name: name,
            description: description,
            badgeType: badgeType,
            issuedAt: block.timestamp
        });

        emit BadgeIssued(to, tokenId, name, badgeType);

        return tokenId;
    }

    /**
     * @dev Get badge details by token ID
     * @param tokenId The ID of the badge
     * @return Badge struct containing badge details
     */
    function getBadge(uint256 tokenId) external view returns (Badge memory) {
        require(_exists(tokenId), "Badge does not exist");
        return badges[tokenId];
    }

    /**
     * @dev Get all badges owned by an address
     * @param owner Address to get badges for
     * @return tokenIds Array of token IDs owned by the address
     */
    function getBadgesByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }
}