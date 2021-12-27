const { expect } = require("chai");
const { ethers } = require("hardhat");

beforeEach(async function () {
    FudFarm = await ethers.getContractFactory("FudFarm");
    fudFarm = await FudFarm.deploy(
        "FudFarm",
        "FUDFARM",
        "ipfs://QmaW33qhL8JD9D1cosCcrHGHtq8Q2krWfUYAgxGHnsz53p/"
    );

    CropToken = await ethers.getContractFactory("CropToken");
    cropToken = await CropToken.deploy(
        fudFarm.address,
        "1666666666666666",
        "3600000");

    accounts = await ethers.getSigners();
    contractOwnerAddress = fudFarm.address;
    tokenContractAddress = cropToken.address;
    owner = accounts[0];
});

describe("FudFarm Test Whitelist mint", function () {
 
    it("should allow infinite mint for whitelist", async function () {

        // Fill whitelist array with accounts
        const minters = [accounts[1].address, accounts[2].address, accounts[3].address];

        await cropToken.setWhitelist(minters);
        
        // Attempt large mint with whitelist account
        await cropToken.connect(accounts[1]).mint(accounts[1].address, "100000000000000000");

        // Assert mint
        expect(await cropToken.balanceOf(accounts[1].address)).to.equal("100000000000000000");
    });
});

describe("FudFarm Test Whitelist mint", function () {
 
    it("should NOT allow infinite mint for non-whitelist", async function () {

        // Fill whitelist array with accounts
        const minters = [accounts[1].address, accounts[2].address, accounts[3].address];

        await cropToken.setWhitelist(minters);
        
        // Attempt large mint with non-whitelist account
        await expect(cropToken.connect(accounts[4]).mint(accounts[4].address, "100000000000000000")).to.be.revertedWith('GET OUT YOU NOT WHITELISTED, SER.');
    });
});
  