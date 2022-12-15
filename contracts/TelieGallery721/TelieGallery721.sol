// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TelieGallery721 is ERC721 {
  // =============================================================
  //                       Variables & Constants
  // =============================================================

  uint256 public tokenId;
  uint256 public mintFee = 2 ether;
  mapping(uint256 => string) private _tokenURI;

  uint8 public constant VERSION = 1;
  address public owner;
  bool public paused;

  // =============================================================
  //                              Events
  // =============================================================

  event OwnerUpdated(address indexed newOwner);
  event TogglePause(bool indexed paused);
  event MintFeeUpdated(uint256 indexed newFee);
  event BalanceWithdrew(uint256 indexed balance);

  // =============================================================
  //                            Constructor
  // =============================================================

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    owner = msg.sender;
    paused = false;
  }

  // =============================================================
  //                             Modifiers
  // =============================================================

  modifier onlyOwner() {
    require(msg.sender == owner, "Telie: not owner");
    _;
  }

  modifier notPaused() {
    require(!paused, "Telie: paused");
    _;
  }

  // =============================================================
  //                       Management Functions
  // =============================================================

  function togglePause() external onlyOwner {
    paused = !paused;
    emit TogglePause(paused);
  }

  function withdrawal() external onlyOwner {
    uint256 balance = address(this).balance;
    (bool success, ) = msg.sender.call{value: balance}("");

    require(success, "Telie: unsuccessful withdrawal");
    emit BalanceWithdrew(balance);
  }

  function updateOwner(address newOwner) external notPaused onlyOwner {
    require(newOwner != owner, "Telie: already owner");
    owner = newOwner;
    emit OwnerUpdated(newOwner);
  }

  function updateMintFee(uint256 newFee) external notPaused onlyOwner {
    mintFee = newFee;
    emit MintFeeUpdated(newFee);
  }

  // =============================================================
  //                       Operational Functions
  // =============================================================

  function tokenURI(uint256 _tokenId)
    public
    view
    override
    returns (string memory)
  {
    return _tokenURI[_tokenId];
  }

  function mint(string memory uriString) external payable {
    require(msg.value >= mintFee, "Telie: fee required");
    require(bytes(uriString).length > 9, "Telie: short URI");

    tokenId++;
    _tokenURI[tokenId] = uriString;
    _safeMint(msg.sender, tokenId, "");
  }

  function burn(uint256 _tokenId) external {
    require(_isApprovedOrOwner(msg.sender, _tokenId), "Telie: not token owner");
    _burn(tokenId);
  }

  // =============================================================
  //                        Internal Functions
  // =============================================================

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 amount
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, amount);
    require(!paused, "Telie: paused");
  }
}
