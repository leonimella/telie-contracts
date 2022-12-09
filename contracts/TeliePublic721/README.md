# TeliePublic721.sol Specification

## Spec

- This is a ERC721 NFT contract
- Users can pay a fee and mint tokens with the desired tokenURI, as many as they wish
- The mint fee is set to 2 MATIC at deployment time
- Users can also burn and transfer their tokens if they wish without fees
- The Token URI can’t be updated after minted
- The owner of the contract is defined at deployment time
- Only the owner of the contract can transfer the owner status
- Only the owner of the contract can withdrawal contract funds as they wish
- Only the owner has the ability to pause the contract.
- In this status mint, burn, transfers, fee update and owner update are locked until the contract is unpaused
