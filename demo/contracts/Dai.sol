// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Dai is ERC20 {
    address private constant makerDAOAddress = address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);

    constructor(
        uint256 amount,
        address approveVaultAddress,
        address borrowerAddress
    ) ERC20("DAI Token", "DAI") {
        _mint(makerDAOAddress, amount);
        _approve(makerDAOAddress, approveVaultAddress, amount);
        _approve(borrowerAddress, approveVaultAddress, amount);
    }

    function burn(address borrowerAddress, uint256 amount) public {
        return _burn(borrowerAddress, amount);
    }
}
