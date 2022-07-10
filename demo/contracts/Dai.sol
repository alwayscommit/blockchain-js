// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Dai is ERC20 {
    address private constant makerDAOAddress = address(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);

    constructor(uint256 amount) ERC20("DAI Token", "DAI") {
        _mint(makerDAOAddress, amount);
    }
}
