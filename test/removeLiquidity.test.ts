import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("Remove Liquidity", function () {
    let swapContract: any;
    let tokenA: any;
    let tokenB: any;
    let owner: Signer;
    let addr1: Signer;
    const approvedAmount = ethers.parseEther("1000");
    const liquidtyAmount = ethers.parseEther("100");
    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy mock ERC20 tokens
        const Token = await ethers.getContractFactory("MockERC20");
        tokenA = await Token.deploy("Token A", "TKA", approvedAmount);
        tokenB = await Token.deploy("Token B", "TKB", approvedAmount);
       

        // Deploy OneToOneSwap contract
        const SwapContract = await ethers.getContractFactory("OneToOneSwap");
        swapContract = await SwapContract.deploy(tokenA.target, tokenB.target);
        

        // Approve the swap contract to spend tokens on behalf of the owner
        await tokenA.connect(owner).approve(swapContract.target,liquidtyAmount);
        await tokenB.connect(owner).approve(swapContract.target,liquidtyAmount);

        // Add initial liquidity
        await swapContract.connect(owner).addLiquidity(liquidtyAmount, liquidtyAmount);
    });

    it("should remove liquidity successfully", async function () {
        const amountA = ethers.parseEther("50");
        const amountB = ethers.parseEther("50");

        await expect(swapContract.connect(owner).removeLiquidity(amountA, amountB))
            .to.emit(swapContract, "RemoveLiquidity")
            .withArgs(await owner.getAddress(), amountA, amountB);

        expect(await tokenA.balanceOf(swapContract.target)).to.equal(ethers.parseEther("50"));
        expect(await tokenB.balanceOf(swapContract.target)).to.equal(ethers.parseEther("50"));
    });

    it("should fail to remove liquidity without admin role", async function () {
        const amountA = ethers.parseEther("50");
        const amountB = ethers.parseEther("50");

        await expect(swapContract.connect(addr1).removeLiquidity(amountA, amountB)).to.be.revertedWithCustomError(
            swapContract,"AccessControlUnauthorizedAccount"
        );
    });

    it("should revert when tokenA transfer fails", async function () {
        const amountA = ethers.parseEther("200"); // Exceeding contract's balance
        const amountB = ethers.parseEther("50");

        await expect(swapContract.connect(owner).removeLiquidity(amountA, amountB)).to.be.revertedWithCustomError(
            tokenA,"ERC20InsufficientBalance").withArgs(swapContract.target,liquidtyAmount,amountA);
    });

    it("should revert when tokenB transfer fails", async function () {
        const amountA = ethers.parseEther("50");
        const amountB = ethers.parseEther("200"); // Exceeding contract's balance

        await expect(swapContract.connect(owner).removeLiquidity(amountA, amountB)).to.be.revertedWithCustomError(
            tokenB,"ERC20InsufficientBalance").withArgs(swapContract.target,liquidtyAmount,amountB);
    });
});
