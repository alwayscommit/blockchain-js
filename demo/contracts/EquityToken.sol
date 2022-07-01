// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error EquityToken__NotOwner();

contract EquityToken is ERC20 {
    uint256 private s_currentValuation;
    //owner = centralized entity
    address private immutable i_owner;
    //unique id of the person who wants to borrow DAI through this centralized entity
    uint256 private immutable i_borrowerUUID;
    AggregatorV3Interface private s_priceFeed;

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert EquityToken__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress, uint256 borrowerUUID)
        ERC20("EquityToken", "EQT")
    {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_borrowerUUID = borrowerUUID;
    }

    function getBorrowerName() public view returns (uint256) {
        return i_borrowerUUID;
    }
}
