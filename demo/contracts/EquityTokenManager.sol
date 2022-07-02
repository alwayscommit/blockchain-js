// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";

//get number of apple, microsoft, google stocks

contract EquityTokenManager {
    //centralized entity generating erc20 tokens against a unique person id
    mapping(uint256 => EquityToken) public personTokenMapping;
    address public s_applePriceFeed;
    address public s_googlePriceFeed;
    address public s_microsoftPriceFeed;

    constructor(
        address applePriceFeed,
        address googlePriceFeed,
        address microsoftPriceFeed
    ) {
        s_applePriceFeed = applePriceFeed;
        s_googlePriceFeed = googlePriceFeed;
        s_microsoftPriceFeed = microsoftPriceFeed;
    }

    function createToken(
        uint256 _borrowerUUID,
        uint256 appleStocks,
        uint256 microsoftStocks,
        uint256 googleStocks
    ) public {
        EquityToken equityToken = new EquityToken(
            _borrowerUUID,
            appleStocks,
            microsoftStocks,
            googleStocks,
            s_applePriceFeed,
            s_googlePriceFeed,
            s_microsoftPriceFeed
        );
        personTokenMapping[_borrowerUUID] = equityToken;
    }

    function getValuation(uint256 _borrowerUUID) public returns (uint256) {
        return personTokenMapping[_borrowerUUID].getValuation();
    }

    function getEquityCount(uint256 _borrowerUUID, string calldata equityName)
        public
        view
        returns (uint256)
    {
        return personTokenMapping[_borrowerUUID].getEquityCount(equityName);
    }
}
