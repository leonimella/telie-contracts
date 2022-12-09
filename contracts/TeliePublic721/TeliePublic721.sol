// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeliePublic721 is ERC721 {
  // =============================================================
  //                       Variables & Constants
  // =============================================================
  uint8 public constant VERSION = 1;
  address public owner;
  bool public paused;

  uint256 public mintFee = 2 ether;

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
}
