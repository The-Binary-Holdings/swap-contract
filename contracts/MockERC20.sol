// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @dev A mock ERC20 token contract for testing purposes.
 */
contract MockERC20 is ERC20 {
    /**
     * @dev Constructor that gives msg.sender all of the existing tokens.
     * @param name Name of the token.
     * @param symbol Symbol of the token.
     * @param initialSupply Initial supply of tokens (in wei units).
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Function to mint tokens. Can be used in tests to generate additional tokens.
     * @param account The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
