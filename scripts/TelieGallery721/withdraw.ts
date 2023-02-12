import { ethers } from "hardhat";
import telieJSON from "../../artifacts/contracts/TelieGallery721/TelieGallery721.sol/TelieGallery721.json";

async function main() {
  const address = "0x1281C9b875CE53393D2b9563884a34A785c44168"; // MUMBAI
  // const address = "0x4fd8592c0b1dc23ed7a05604082b0b0061c36173"; // POLYGON
  const [owner] = await ethers.getSigners();
  const telie721 = new ethers.Contract(address, telieJSON.abi, owner);

  // MUMBAI (Wrong function name, need to update contract first)
  // const tx = await telie721.withdrawal();

  // MATIC
  const tx = await telie721.withdraw();

  console.log("Awaiting transaction confirmation:", tx.hash);
  await tx.wait(2);
  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
