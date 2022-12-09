import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TeliePublic721", async () => {
  async function setupFixture() {
    const [owner] = await ethers.getSigners();
    const Telie721 = await ethers.getContractFactory("TeliePublic721");
    const telie721 = await Telie721.connect(owner).deploy("Test Deploy", "TD");

    return { telie721 };
  }

  describe("Ownership", async () => {
    it("Deployer is Owner", async () => {
      const [deployer] = await ethers.getSigners();
      const Telie721 = await ethers.getContractFactory("TeliePublic721");
      const telie721 = await Telie721.connect(deployer).deploy(
        "Test Deploy",
        "TD"
      );

      await telie721.deployed();
      const ownerAdr = await telie721.owner();

      expect(ownerAdr).to.be.equals(deployer.address);
    });

    it("Owner should update new owner", async () => {
      const { telie721 } = await loadFixture(setupFixture);
      const [owner, alice] = await ethers.getSigners();

      await telie721.connect(owner).updateOwner(alice.address);
      const newOwnerAdr = await telie721.owner();

      expect(newOwnerAdr).to.be.equals(alice.address);
    });

    it("Reverts if non-owner try to change owner", async () => {
      const { telie721 } = await loadFixture(setupFixture);
      const [owner, alice] = await ethers.getSigners();

      await expect(
        telie721.connect(alice).updateOwner(alice.address)
      ).to.revertedWith("Telie: not owner");
    });

    it("Reverts if current owner calls updateOwner", async () => {
      const { telie721 } = await loadFixture(setupFixture);
      const [owner] = await ethers.getSigners();

      await expect(
        telie721.connect(owner).updateOwner(owner.address)
      ).to.revertedWith("Telie: already owner");
    });
  });
});
