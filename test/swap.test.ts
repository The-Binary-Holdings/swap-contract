import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("OneToOneSwap", function () {
    let swapContract: any;
    let tokenA: any;
    let tokenB: any;
    let owner: Signer;
    let addr1: Signer;
    const approvedAmount =  ethers.parseEther("10000");
    const liquidtyAmount =  ethers.parseEther("1000");
    const userInitBal = ethers.parseEther("100");
    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy mock ERC20 tokens
        const Token = await ethers.getContractFactory("MockERC20");
        tokenA = await Token.deploy("Token A", "TKA",approvedAmount);

        tokenB = await Token.deploy("Token B", "TKB",approvedAmount);
        

        // Deploy OneToOneSwap contract
        const SwapContract = await ethers.getContractFactory("OneToOneSwap");
        swapContract = await SwapContract.deploy(tokenA.target, tokenB.target);
        
        // Approve the swap contract to spend tokens on behalf of the owner
        await tokenA.connect(owner).approve(swapContract.target, approvedAmount);
        await tokenB.connect(owner).approve(swapContract.target, approvedAmount);

        // Add initial liquidity
        await swapContract.connect(owner).addLiquidity(liquidtyAmount, liquidtyAmount);

        //Transfer tokenA and tokenB to user 
        await tokenA.connect(owner).transfer(await addr1.getAddress(),userInitBal);
        await tokenB.connect(owner).transfer(await addr1.getAddress(),userInitBal);
    });

    it("should swap tokenA for tokenB successfully", async function () {
        const amount = ethers.parseEther("10");
        await tokenA.connect(addr1).approve(swapContract.target,amount)
        await expect(swapContract.connect(addr1).swap(tokenA.target, amount))
            .to.emit(swapContract, "Swap")
            .withArgs(await addr1.getAddress(), tokenA.target, tokenB.target, amount);

        expect(await tokenA.balanceOf(swapContract.target)).to.equal(liquidtyAmount + amount);
        expect(await tokenB.balanceOf(swapContract.target)).to.equal(liquidtyAmount - amount);
        expect(await tokenA.balanceOf(await addr1.getAddress())).to.equal(userInitBal - amount);
        expect(await tokenB.balanceOf(await addr1.getAddress())).to.equal(userInitBal + amount);
    });

    it("should swap tokenB for tokenA successfully", async function () {
        const amount = ethers.parseEther("10");
        await tokenB.connect(addr1).approve(swapContract.target,amount)
        await expect(swapContract.connect(addr1).swap(tokenB.target, amount))
            .to.emit(swapContract, "Swap")
            .withArgs(await addr1.getAddress(), tokenB.target, tokenA.target, amount);

        expect(await tokenB.balanceOf(swapContract.target)).to.equal(liquidtyAmount + amount);
        expect(await tokenA.balanceOf(swapContract.target)).to.equal(liquidtyAmount - amount);
        expect(await tokenB.balanceOf(await addr1.getAddress())).to.equal(userInitBal - amount);
        expect(await tokenA.balanceOf(await addr1.getAddress())).to.equal(userInitBal + amount);
    });

    it("should revert when swapping with invalid token address", async function () {
        const invalidToken = ethers.Wallet.createRandom().address;
        const amount = ethers.parseEther("10");

        await expect(swapContract.connect(owner).swap(invalidToken, amount)).to.be.revertedWith(
            "Invalid token"
        );
    });

    it("should revert when insufficient liquidity for swap", async function () {
        const amount = ethers.parseEther("1001"); // More than available liquidity in the contract

        await expect(swapContract.connect(owner).swap(tokenA.target, amount)).to.be.revertedWith(
            "Insufficient liquidity"
        );
    });
    
});
