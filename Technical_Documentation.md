# OneToOneSwap Contract - Technical Document

## Introduction
The `OneToOneSwap` contract is a Solidity-based smart contract that allows users to perform 1:1 swaps between two ERC20 tokens. The contract also supports liquidity management functions, enabling an admin to add or remove liquidity.

## System Overview
The `OneToOneSwap` contract is designed for scenarios where users need to exchange two specific tokens at a 1:1 ratio. The contract ensures that there are no fees involved, and the process is secure, thanks to built-in protections like reentrancy guards and role-based access control.

### Components
1. **Swap Mechanism:**
   - Users can swap between `tokenA` and `tokenB` at a 1:1 ratio.
   - The contract ensures that sufficient liquidity is available before performing the swap.

2. **Liquidity Management:**
   - Admins can add or remove liquidity to/from the contract using `addLiquidity` and `removeLiquidity` functions.
   - Liquidity is essential to enable users to swap tokens.

3. **Security:**
   - The contract uses OpenZeppelin’s `ReentrancyGuard` to prevent reentrancy attacks.
   - `AccessControl` is used to restrict liquidity management functions to admin accounts only.

## Data Structures
- **State Variables:**
  - `address public tokenA;` - The address of the first token.
  - `address public tokenB;` - The address of the second token.
  - `bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");` - Admin role identifier.

## Contract Methods
1. **addLiquidity(uint256 amountA, uint256 amountB):**
   - Allows an admin to add liquidity to the contract.
   - Transfers `amountA` of `tokenA` and `amountB` of `tokenB` from the admin to the contract.
   - Emits an `AddLiquidity` event.

2. **removeLiquidity(uint256 amountA, uint256 amountB):**
   - Allows an admin to remove liquidity from the contract.
   - Transfers `amountA` of `tokenA` and `amountB` of `tokenB` from the contract to the admin.
   - Emits a `RemoveLiquidity` event.

3. **swap(address tokenIn, uint256 amount):**
   - Allows users to swap tokens at a 1:1 ratio.
   - Ensures sufficient liquidity of the token to be swapped out.
   - Transfers `amount` of `tokenIn` from the user to the contract and an equivalent amount of the other token from the contract to the user.
   - Emits a `Swap` event.

## Error Handling
- The contract uses `require` statements and `try/catch` blocks to handle potential errors, ensuring that transactions fail gracefully and with meaningful error messages.

## Intended Functionality
The contract is intended for use in environments where a simple, fee-less 1:1 token swap is required, such as token migrations or fixed exchange scenarios. It is designed to be easily integrated into larger DeFi ecosystems where such functionality might be needed.

# Security Audit Scope - OneToOneSwap Contract

## Audit Overview
The objective of this audit is to evaluate the security, correctness, and efficiency of the `OneToOneSwap` contract. This document outlines the specific areas that will be covered in the audit.

### 1. Scope of the Audit
#### What will be audited?
- **Smart Contract:** The entire `OneToOneSwap.sol` file.
- **Core Functions:**
  - `addLiquidity(uint256 amountA, uint256 amountB)`
  - `removeLiquidity(uint256 amountA, uint256 amountB)`
  - `swap(address tokenIn, uint256 amount)`

#### How will the audit be performed?
- **Static Analysis:** Automated tools will be employed to identify common vulnerabilities such as reentrancy, overflow/underflow, and access control weaknesses.
- **Manual Code Review:** A line-by-line code review will be conducted to ensure the contract is free from bugs, vulnerabilities, and inefficiencies.
- **Testing:** Unit tests will be executed to confirm that the contract behaves as expected. Additional tests will be created to cover edge cases and stress scenarios.

### 2. Critical Modules
- **Swap Functionality:** Ensuring that the 1:1 swap between `tokenA` and `tokenB` is performed correctly and securely.
- **Liquidity Management:** Validating that liquidity can be added and removed by admins without introducing vulnerabilities.
- **Security Measures:** Reviewing the implementation of `ReentrancyGuard` and `AccessControl` to ensure robust protection against attacks.

### 3. Primary Goals
- **Security:** Identify and address any vulnerabilities that could lead to unauthorized access, loss of funds, or incorrect operations.
- **Correctness:** Ensure that the contract functions exactly as intended, especially in terms of swapping tokens and managing liquidity.
- **Optimization:** Identify opportunities to reduce gas consumption and improve the efficiency of the contract.

### 4. Specific Concerns
- **Reentrancy Attacks:** Ensuring that the `ReentrancyGuard` is properly implemented and covers all critical functions.
- **Access Control:** Verifying that only authorized addresses can perform actions restricted to admins, such as adding and removing liquidity.

## Conclusion
The audit will be comprehensive, covering all aspects of the `OneToOneSwap` contract to ensure it is secure, efficient, and correctly implemented. The findings will be detailed in an audit report, highlighting any issues and recommending improvements.


