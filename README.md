# OneToOneSwap Contract

## Overview
The `OneToOneSwap` contract facilitates a 1:1 token swap between two ERC20 tokens without any fees. This contract is designed to be simple and efficient, allowing users to swap tokens, add, or remove liquidity.

## Features
- **1:1 Token Swap:** Users can swap between two predefined ERC20 tokens at a 1:1 ratio.
- **Liquidity Management:** Admins can add or remove liquidity from the contract.
- **Security:** The contract leverages OpenZeppelin’s `ReentrancyGuard` and `AccessControl` for security and access management.

## Requirements
- **Solidity Version:** 0.8.25
- **Tokens:** The contract operates with two predefined ERC20 tokens.

### Setup
1. Clone the repository:
   ```bash
   git clone <repo-link>

2. Install the necessary dependencies :
   ```bash
   npm i 

3.Compile and test Contracts
   ```bash
   npx hardhat compile
   npx hardhat test



