const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {

    let Token
    let hardhatToken 
    let owner 
    let addr1 
    let addr2 
    let stakeTotalsupply = 10000


    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        
        Token = await ethers.getContractFactory("ERC20");
        hardhatToken = await Token.deploy(stakeTotalsupply, addr1, addr1);
        await hardhatToken.deployed();
      });

      

        describe("Getters check", function() {
        it("add, remove, is", async function() {
            await hardhatToken.addStakeholder(addr1.getAddress());
            expect(await hardhatToken.isStakeholder(addr1)).to.eq(true);


        });
    });
});