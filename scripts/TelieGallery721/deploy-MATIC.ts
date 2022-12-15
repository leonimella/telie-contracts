import { ethers } from "hardhat";

async function main() {
  const { chainId } = await ethers.provider.getNetwork();
  if (chainId !== 137) throw new Error("ONLY MATIC DEPLOYMENT");

  const [owner] = await ethers.getSigners();
  const Telie721 = await ethers.getContractFactory("TelieGallery721");
  const telie721 = await Telie721.deploy("Telie Gallery", "TELIEG721");

  await telie721.deployed();

  console.log("Telie721: ", telie721.address);
  console.log("   Owner: ", owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
