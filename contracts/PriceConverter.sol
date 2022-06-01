//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//all functions are internal
//can't have state variables, can't send ether to this
library PriceConverter {

    function getVersion() internal view returns (uint256){
        //interfaces compile down to ABI - Application Binary Interface
        // ABI tells solidity and other programming languages how it can interact with another contract
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // tuple is list of objects of potentially different data types 
                // (
                //     uint80 roundId,
                //     int256 answer,
                //     uint256 startedAt,
                //     uint256 updatedAt,
                //     uint80 answeredInRound
                // ) = priceFeed.latestRoundData();

                 // to avoid the warnings of unused variables, because we only need price here,
                // we can return empty placeholders.
                (,int256 answer,,,) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000); // 1**10 = 10000000000
        //we multiply this number by 10 to match the wei standard            
    }

    //1000000000
    function getConversionRate(uint256 ethAmount) internal view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1000000000000000000;
        //0.000002078100000000
        //https://eth-converter.com/
        return ethAmountInUSD;
    }

}