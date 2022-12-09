// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeliePublic721 is ERC721 {
  address public owner;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    owner = msg.sender;
  }
}
