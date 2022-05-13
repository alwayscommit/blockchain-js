// SPDX-License-Identifier: MIT

pragma solidity >0.6.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {

    mapping(address => uint256) public addressAmountMap;

    //https://docs.chain.link/

    function fund() public payable {
        addressAmountMap[msg.sender] = addressAmountMap[msg.sender] + msg.value;
        // the ETH -> USD conversion rate
    }

    function getVersion public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
    }



}