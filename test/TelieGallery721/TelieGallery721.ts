import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const defaultUri =
  "https://gateway.pinata.cloud/ipfs/QmU2spNtQwJ4Q1fhoBrwpnMy5nmhrpWfnSeZK1Pcmehi5q";
function parseEther(value: string) {
  return ethers.utils.parseEther(value);
}

describe("TelieGallery721", async () => {
  async function setupFixture() {
    const [owner] = await ethers.getSigners();
    const Telie721 = await ethers.getContractFactory("TelieGallery721");
    const telie721 = await Telie721.connect(owner).deploy("Test Deploy", "TD");

    return { telie721 };
  }

  describe("Management", async () => {
    describe("Ownership", async () => {
      it("Deployer is Owner", async () => {
        const [deployer] = await ethers.getSigners();
        const Telie721 = await ethers.getContractFactory("TelieGallery721");
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

      it("Reverts if owner transfer user tokens", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner, alice] = await ethers.getSigners();

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });

        const transferCall = telie721
          .connect(owner)
          ["safeTransferFrom(address,address,uint256)"](
            alice.address,
            owner.address,
            1
          );
        await expect(transferCall).to.revertedWith(
          "ERC721: caller is not token owner or approved"
        );
      });

      it("Emits OwnerUpdated", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner, alice] = await ethers.getSigners();

        await expect(
          telie721.connect(owner).updateOwner(alice.address)
        ).to.emit(telie721, "OwnerUpdated");
      });
    });

    describe("Pause", async () => {
      it("Deployed in not paused state", async () => {
        const Telie721 = await ethers.getContractFactory("TelieGallery721");
        const telie721 = await Telie721.deploy("Test Deploy", "TD");

        await telie721.deployed();

        const paused = await telie721.paused();
        expect(false).to.be.equals(paused);
      });

      it("Token transfers go through if not paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice, bob] = await ethers.getSigners();
        const currentBobBalance = await telie721.balanceOf(bob.address);

        const paused = await telie721.paused();
        expect(false).to.be.equals(paused);
        expect(0).to.be.equals(currentBobBalance);

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });

        await telie721
          .connect(alice)
          ["safeTransferFrom(address,address,uint256)"](
            alice.address,
            bob.address,
            1
          );

        const updatedBobBalance = await telie721.balanceOf(bob.address);
        expect(1).to.be.equals(updatedBobBalance);
      });

      it("Token transfers must revert if it is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice, bob] = await ethers.getSigners();

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });

        await telie721.togglePause();
        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        const transferCall = telie721
          .connect(alice)
          ["safeTransferFrom(address,address,uint256)"](
            alice.address,
            bob.address,
            1
          );

        await expect(transferCall).to.revertedWith("Telie: paused");
      });

      it("Token mint go through if not paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        const paused = await telie721.paused();
        expect(false).to.be.equals(paused);

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });
      });

      it("Token mint must revert if it is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await telie721.togglePause();
        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        await expect(
          telie721.connect(alice).mint(defaultUri, { value: parseEther("2") })
        ).to.revertedWith("Telie: paused");
      });

      it("Token burn go through if not paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });

        const paused = await telie721.paused();
        expect(false).to.be.equals(paused);

        await telie721.connect(alice).burn(1);
      });

      it("Token burn must revert if it is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await telie721
          .connect(alice)
          .mint(defaultUri, { value: parseEther("2") });

        await telie721.togglePause();
        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        await expect(telie721.connect(alice).burn(1)).to.revertedWith(
          "Telie: paused"
        );
      });

      it("Should update owner if contract is not paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner, alice] = await ethers.getSigners();
        const paused = await telie721.paused();

        expect(false).to.be.equals(paused);

        await telie721.connect(owner).updateOwner(alice.address);
        const newOwnerAdr = await telie721.owner();

        expect(newOwnerAdr).to.be.equals(alice.address);
      });

      it("Reverts update owner if contract is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner, alice] = await ethers.getSigners();

        await telie721.togglePause();

        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        await expect(
          telie721.connect(owner).updateOwner(alice.address)
        ).to.revertedWith("Telie: paused");
      });

      it("Owner should pause/unpause contract", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner] = await ethers.getSigners();

        let paused = await telie721.paused();
        expect(false).to.be.equals(paused);

        await telie721.connect(owner).togglePause();

        paused = await telie721.paused();
        expect(true).to.be.equals(paused);
      });

      it("Reverts if not owner pause/unpause contract", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await expect(telie721.connect(alice).togglePause()).to.revertedWith(
          "Telie: not owner"
        );
      });

      it("Emits TogglePause", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        await expect(telie721.togglePause()).to.emit(telie721, "TogglePause");
      });
    });

    describe("Mint Fee", async () => {
      it("Owner should update mint fee", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const currentFee = await telie721.mintFee();
        const newFee = parseEther("2");

        expect(currentFee).to.be.equals(parseEther("1"));
        await telie721.updateMintFee(newFee);

        const updatedFee = await telie721.mintFee();
        expect(updatedFee).to.be.equals(newFee);
      });

      it("Reverts if not owner try to update mint fee", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await expect(
          telie721.connect(alice).updateMintFee(parseEther("0"))
        ).to.revertedWith("Telie: not owner");
      });

      it("Should update mint fee if not paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const paused = await telie721.paused();
        const newFee = parseEther("1");

        expect(false).to.be.equals(paused);
        await telie721.updateMintFee(newFee);

        const updatedFee = await telie721.mintFee();
        expect(updatedFee).to.be.equals(newFee);
      });

      it("Reverts update of mint fee if is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);

        await telie721.togglePause();
        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        await expect(telie721.updateMintFee(parseEther("1"))).to.revertedWith(
          "Telie: paused"
        );
      });

      it("Emits FeeUpdated", async () => {
        const { telie721 } = await loadFixture(setupFixture);

        await expect(telie721.updateMintFee(parseEther("1"))).to.emit(
          telie721,
          "MintFeeUpdated"
        );
      });
    });

    describe("Withdrawal", async () => {
      it("Owner should withdraw all contract balance", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [owner] = await ethers.getSigners();
        const ownerCurrentBalance = await owner.getBalance();
        const contractBalance = await telie721.provider.getBalance(
          telie721.address
        );

        await telie721.withdraw();
        const ownerUpdatedBalance = await owner.getBalance();

        expect(ownerUpdatedBalance).to.be.closeTo(
          ownerCurrentBalance.add(contractBalance),
          parseEther("0.0001")
        );
      });

      it("Reverts if non-owner call withdraw", async () => {
        const { telie721 } = await loadFixture(setupFixture);
        const [_, alice] = await ethers.getSigners();

        await expect(telie721.connect(alice).withdraw()).to.revertedWith(
          "Telie: not owner"
        );
      });

      it("Shoud withdraw if contract is paused", async () => {
        const { telie721 } = await loadFixture(setupFixture);

        await telie721.togglePause();
        const paused = await telie721.paused();
        expect(true).to.be.equals(paused);

        await telie721.withdraw();
      });

      it("Emits BalanceWithdrew", async () => {
        const { telie721 } = await loadFixture(setupFixture);

        await expect(telie721.withdraw()).to.emit(telie721, "BalanceWithdrew");
      });
    });
  });

  describe("Operational", async () => {
    describe("Tokens", async () => {
      describe("Mint", async () => {
        it("Should mint a new token if the fee was paid", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          const aliceCurrentBalance = await telie721.balanceOf(alice.address);
          expect(0).to.be.equals(aliceCurrentBalance);

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          const aliceUpdatedBalance = await telie721.balanceOf(alice.address);
          expect(1).to.be.equals(aliceUpdatedBalance);
        });

        it("Reverts mint of a new token if the fee was not paid", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await expect(
            telie721.connect(alice).mint(defaultUri)
          ).to.revertedWith("Telie: fee required");
        });

        it("Reverts mint of a new token if the tokenURI is to short", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await expect(
            telie721
              .connect(alice)
              .mint("short_uri", { value: parseEther("2") })
          ).to.revertedWith("Telie: short URI");
        });

        it("Same address can have multiple tokens", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          const aliceCurrentBalance = await telie721.balanceOf(alice.address);
          expect(0).to.be.equals(aliceCurrentBalance);

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });
          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          const aliceUpdatedBalance = await telie721.balanceOf(alice.address);
          expect(2).to.be.equals(aliceUpdatedBalance);
        });

        it("Correctly increment tokenId after a new token mint", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          const currentTokenId = await telie721.tokenId();
          expect(0).to.be.equals(currentTokenId);

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });
          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          const updatedTokenId = await telie721.tokenId();
          expect(2).to.be.equals(updatedTokenId);
        });

        it("Correclty assigns the tokenURI with the tokenId", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          const contractTokenURI = await telie721.tokenURI(1);
          expect(contractTokenURI).to.be.equals(defaultUri);
        });

        it("Emits Transfer", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await expect(
            telie721.connect(alice).mint(defaultUri, { value: parseEther("2") })
          ).to.emit(telie721, "Transfer");
        });
      });

      describe("Burn", async () => {
        it("Should burn the token if caller is the token owner", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          const aliceCurrentBalance = await telie721.balanceOf(alice.address);
          expect(0).to.be.equals(aliceCurrentBalance);

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          const aliceUpdatedBalance = await telie721.balanceOf(alice.address);
          expect(1).to.be.equals(aliceUpdatedBalance);

          await telie721.connect(alice).burn(1);
          const aliceBurnedBalance = await telie721.balanceOf(alice.address);
          expect(0).to.be.equals(aliceBurnedBalance);
        });

        it("Should remove associated URI from _tokenURI", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });
          const uriBefore = await telie721.tokenURI(1);
          expect(uriBefore).to.be.equals(defaultUri);

          await telie721.connect(alice).burn(1);
          const uriAfter = await telie721.tokenURI(1);
          expect(uriAfter).to.be.equals("");
        });

        it("Reverts token burn if caller is not the owner", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice, bob] = await ethers.getSigners();

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          await expect(telie721.connect(bob).burn(1)).to.revertedWith(
            "Telie: not token owner"
          );
        });

        it("Reverts if user try to burn a minted token, but already transfered to another user", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice, bob] = await ethers.getSigners();

          await telie721
            .connect(alice)
            .mint(defaultUri, { value: parseEther("2") });

          await telie721
            .connect(alice)
            ["safeTransferFrom(address,address,uint256)"](
              alice.address,
              bob.address,
              1
            );

          await expect(telie721.connect(alice).burn(1)).to.revertedWith(
            "Telie: not token owner"
          );
        });

        it("Emits Transfer", async () => {
          const { telie721 } = await loadFixture(setupFixture);
          const [_, alice] = await ethers.getSigners();

          await expect(
            telie721.connect(alice).mint(defaultUri, { value: parseEther("2") })
          ).to.emit(telie721, "Transfer");
        });
      });
    });
  });
});
