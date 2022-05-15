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

    function getVersion() public view returns (uint256){
        //interfaces compile down to ABI - Application Binary Interface
        // ABI tells solidity and other programming languages how it can interact with another contract
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // tuple is list of objects of potentially different data types 
                // (
                //     uint80 roundId,
                //     int256 answer,
                //     uint256 startedAt,
                //     uint256 updatedAt,
                //     uint80 answeredInRound
                // ) = priceFeed.latestRoundData();

                 (// to avoid the warnings of unused variables, because we only need price here,
                // we can return empty placeholders.
                    ,
                    int256 answer,
                    ,
                    ,
                    
                ) = priceFeed.latestRoundData();
        return uint256(answer);            
    }

    




}