const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Contract } = require("ethers");

describe("RkuToken", function() {

    let rkuToken = Contract;
    let zeroAddress = '0x0000000000000000000000000000000000000000';

    beforeEach(async function() {
        const RkuToken = await ethers.getContractFactory("RkuToken");
        rkuToken = await RkuToken.deploy(
            "RkuToken",
            "RKU",
            5,
            100000
        );
        [owner, addr1, addr2] = await ethers.getSigners();
        await rkuToken.deployed();
    });

    it("name: should be able to get coin's name.", async function() {
        expect(await rkuToken.name()).to.eq("RkuToken");
    });

    it("symbol: should be able to get coin's symbol.", async function() {
        expect(await rkuToken.symbol()).to.eq("RKU");
    });

    it("demicals: should be able to get coin's demicals.", async function(){
        expect(await rkuToken.demicals()).to.eq(5);
    });

    it("totalSupply: should be able to get coin's amount.", async function(){
        expect(await rkuToken.totalSupply()).to.eq(100000);
    });

    it("balanceOf: should return balance of account1.", async function(){
        expect(await rkuToken.balanceOf(addr1.address)).to.eq(0);
    });

    it("mint: should revert given a zero-address.", async function(){
        await expect(rkuToken.mint(zeroAddress, 100)).to.be.revertedWith('Receiving account must have a non-zero address!');
    });

    it("mint: should give account1 1000 tokens and increase totalSupply by 1000.", async function(){
        const txMint = rkuToken.mint(addr1.address, 1000);
        await expect(txMint).to.emit(rkuToken, "Trancfer");
        const rMint = await (await txMint).wait();
        expect(rMint.events[0].args[0]).to.eq(zeroAddress);
        expect(rMint.events[0].args[1]).to.eq(addr1.address);
        expect(rMint.events[0].args[2]).to.eq(1000); 

        expect(await rkuToken.totalSupply()).to.eq(101000);
    });

    it("burn: should revert given a zero-address.", async function(){
        await expect(rkuToken.burn(zeroAddress, 100)).to.be.revertedWith('Burner account must have a non-zero address!');
    });

    it("burn: should revert given amount to burn exceeds account's balance", async function(){
        await expect(rkuToken.burn(addr1.address, 2000)).to.be.revertedWith("Burn amount must not exceed balance!");
    });

    it("burn: should burn 50 tokens of account1 and decrease totalSupply by 50", async function(){
        await rkuToken.mint(addr1.address, 50);
        const txBurn = rkuToken.burn(addr1.address, 50);
        await expect(txBurn).to.emit(rkuToken, "Trancfer");
        const rBurn = await (await txBurn).wait();
        expect(rBurn.events[0].args[0]).to.eq(addr1.address);
        expect(rBurn.events[0].args[1]).to.eq(zeroAddress);
        expect(rBurn.events[0].args[2]).to.eq(50);

        expect(await rkuToken.totalSupply()).to.eq(100000);
    });

    it("trancfer: should revert upon trying to send to a zero-address.", async function(){
        await expect(rkuToken.trancfer(zeroAddress, 100)).to.be.revertedWith("Byuer must have a non-zero address!");
    });

    it("trancfer: should revert upon trying to send amount which exceeds balance.", async function(){
        await expect(rkuToken.trancfer(addr1.address, 200000)).to.be.revertedWith("Seller does not have the specified amount!")
    });

    it("trancfer: should send 2000 tokens to account1.", async function(){
        const txTrancfer = rkuToken.trancfer(addr1.address, 2000);
        await expect(txTrancfer).to.emit(rkuToken, "Trancfer");
        const rTrancfer = await (await txTrancfer).wait();
        expect(rTrancfer.events[0].args[0]).to.eq(owner.address);
        expect(rTrancfer.events[0].args[1]).to.eq(addr1.address);
        expect(rTrancfer.events[0].args[2]).to.eq(2000);
    });

     it("trancferFrom: should revert if the balance of seller exceeds the amount to transact.", async function() {
       await expect(rkuToken.trancferFrom(addr1.address, addr2.address, 10000)).to.be.revertedWith('Seller does not have the specified amount!');
     });

     it("approve: should revert if delegate has a zero-address.", async function() {
        await expect(rkuToken.approve(zeroAddress, 100)).to.be.revertedWith('Delegate must have a non-zero address!');
      });

      it("approve: should give account2 the ability to transact up to 5000 tokens from owner's balance.", async () => {
        const txApprove = rkuToken.approve(addr2.address, 5000);
        await expect(txApprove).to.emit(rkuToken, "Approval");
        const rApprove = await (await txApprove).wait();
        expect(rApprove.events[0].args[0]).to.equal(owner.address);
        expect(rApprove.events[0].args[1]).to.equal(addr2.address);
        expect(rApprove.events[0].args[2]).to.equal(5000);
      });

      it("allowance: should be able to see that account2 now has a 5000 token allowance from the owner.", async function() {
        await rkuToken.approve(addr2.address, 5000);
        expect(await rkuToken.allowance(owner.address, addr2.address)).to.equal(5000);
      });
    
      it("trancferFrom: should revert if seller has a zero-address.", async function() {
        await expect(rkuToken.trancferFrom(zeroAddress, addr2.address, 3000)).to.be.revertedWith('Seller must have a non-zero address!');
      });

      it("trancferFrom: account2 should be able to send 5000 tokens on behalf of the owner to account1.", async function() {
        await rkuToken.approve(addr2.address, 5000);
        const txTrancferFrom = rkuToken.connect(addr2).trancferFrom(owner.address, addr1.address, 5000);
        await expect(txTrancferFrom).to.emit(rkuToken, "Trancfer");
        const rTrancferFrom = await (await txTrancferFrom).wait();
        expect(rTrancferFrom.events[0].args[0]).to.equal(owner.address);
        expect(rTrancferFrom.events[0].args[1]).to.equal(addr1.address);
        expect(rTrancferFrom.events[0].args[2]).to.equal(5000);
      });

});