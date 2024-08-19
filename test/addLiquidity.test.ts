import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("Add Liquidity", function () {
    let swapContract: any;
    let tokenA: any;
    let tokenB: any;
    let owner: Signer;
    let addr1: Signer;
    const approvedAmount = ethers.parseEther("1000");

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
        await tokenA.connect(owner).approve(swapContract.target, ethers.parseEther("1000"));
        await tokenB.connect(owner).approve(swapContract.target, ethers.parseEther("1000"));
    });

    it("should add liquidity successfully", async function () {
        const amountA = ethers.parseEther("100");
        const amountB = ethers.parseEther("100");

        await expect(swapContract.connect(owner).addLiquidity(amountA, amountB))
            .to.emit(swapContract, "AddLiquidity")
            .withArgs(await owner.getAddress(), amountA, amountB);

        expect(await tokenA.balanceOf(swapContract.target)).to.equal(amountA);
        expect(await tokenB.balanceOf(swapContract.target)).to.equal(amountB);
    });

    it("should fail to add liquidity without admin role", async function () {
        const amountA = ethers.parseEther("50");
        const amountB = ethers.parseEther("50");

        await expect(swapContract.connect(addr1).addLiquidity(amountA, amountB)).to.be.revertedWithCustomError(
           swapContract,"AccessControlUnauthorizedAccount"
        );
    });

    it("should revert when tokenA transfer fails", async function () {
        const amountA = ethers.parseEther("1500"); // Exceeding owner's approval
        const amountB = ethers.parseEther("100");
        await expect(swapContract.connect(owner).addLiquidity(amountA, amountB)).to.be.revertedWithCustomError(tokenA,`ERC20InsufficientAllowance`).withArgs(swapContract.target, approvedAmount, amountA);
    });

    it("should revert when tokenB transfer fails", async function () {
        const amountA = ethers.parseEther("100");
        const amountB = ethers.parseEther("1500"); // Exceeding owner's allowance
        await expect(swapContract.connect(owner).addLiquidity(amountA, amountB)).to.be.revertedWithCustomError(tokenA,`ERC20InsufficientAllowance`).withArgs(swapContract.target, approvedAmount, amountB);
    });
});
