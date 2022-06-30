// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "@openzeppellin/contracts/token/ERC20/ERC20.sol";

error FundMe__NotOwner();

contract EquityToken is ERC20 {
    uint256 private s_currentValuation;
    address private immutable i_owner;
    address private immutable i_borrowerAddress;
    string private immutable i_borrowerName;
    AggregatorV3Interface private s_priceFeed;

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert EquityToken__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) ERC20("EquityToken", "ET") {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function getBorrowerAddress() public view returns (address) {
        return i_borrowerAddress;
    }

    function getBorrowerName() public view returns (string) {
        return i_borrowerName;
    }
}
