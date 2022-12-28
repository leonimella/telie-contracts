// @notice : run the typechain generate commance into the smrt contract repository (truffle in our case), after the contracts are compiled.
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("Bond", async () => {
  it("should issue bonds to a lender", async () => {
    expect(false).to.be.true;
  });
  it("lender should be able to transfer bonds to another address", async () => {
    expect(false).to.be.true;
  });
  it("operator should be able to manipulate bonds after approval", async () => {
    expect(false).to.be.true;
  });

  it("lender should redeem bonds when conditions are met", async () => {
    expect(false).to.be.true;
  });

  it("lender should not be able to redeem bonds when conditions are not met", async () => {
    expect(false).to.be.true;
  });
  //////////////////// UNIT TESTS //////////////////////////////

  it("should transfer bonds from an caller address to another", async () => {
    expect(false).to.be.true;
  });

  it("should issue bonds to a given address", async () => {
    expect(false).to.be.true;
  });

  it("should redeem bonds from a given address", async () => {
    expect(false).to.be.true;
  });

  it("should burn bonds from a given address", async () => {
    expect(false).to.be.true;
  });

  it("should approve spender to manage a given amount of bonds from the caller address", async () => {
    expect(false).to.be.true;
  });

  it("setApprovalFor (called by bond owner) should be able to give operator  permissions to manage bonds for given  classId", async () => {
    expect(false).to.be.true;
  });

  it("should batch approve", async () => {
    expect(false).to.be.true;
  });

  it("should return the active supply", async () => {
    expect(false).to.be.true;
  });

  it("should return the redeemed supply", async () => {
    expect(false).to.be.true;
  });

  it("should return the burned supply", async () => {
    expect(false).to.be.true;
  });

  it("should return the total supply", async () => {
    expect(false).to.be.true;
  });

  it("should return the balanceOf a bond of a given address", async () => {
    expect(false).to.be.true;
  });

  it("should return the symbol of a class of bond", async () => {
    expect(false).to.be.true;
  });

  it("should return the Values for given bond class", async () => {
    expect(false).to.be.true;
  });

  it("should return the infos of a nonce for given bond class", async () => {
    expect(false).to.be.true;
  });

  it("should return if an operator is approved on a class and nonce given for an address", async () => {
    expect(false).to.be.true;
  });

  it("should return if its redeemable", async () => {
    expect(false).to.be.true;
  });

  it("should set allowance of a spender", async () => {
    expect(false).to.be.true;
  });

  it("should return if operator is approved for", async () => {
    expect(false).to.be.true;
  });
});
