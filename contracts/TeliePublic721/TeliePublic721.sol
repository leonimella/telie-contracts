// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeliePublic721 is ERC721 {
  address public owner;
  bool public paused;

  event OwnerUpdated(address indexed newOwner);
  event TogglePause(bool indexed paused);

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    owner = msg.sender;
    paused = false;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Telie: not owner");
    _;
  }

  modifier notPaused() {
    require(!paused, "Telie: paused");
    _;
  }

  function updateOwner(address newOwner) external notPaused onlyOwner {
    require(newOwner != owner, "Telie: already owner");
    owner = newOwner;
    emit OwnerUpdated(newOwner);
  }

  function togglePause() external onlyOwner {
    paused = !paused;
    emit TogglePause(paused);
  }
}
