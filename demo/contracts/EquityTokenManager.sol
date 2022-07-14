// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";

//get number of apple, microsoft, google stocks

contract EquityTokenManager {
    //centralized entity generating erc20 tokens against a unique person id
    mapping(address => EquityToken) public personTokenMapping;
    address private immutable i_owner;
    address public s_applePriceFeed;
    address public s_googlePriceFeed;
    address public s_microsoftPriceFeed;
    uint256 public number;

    constructor(
        address applePriceFeed,
        address googlePriceFeed,
        address microsoftPriceFeed
    ) {
        s_applePriceFeed = applePriceFeed;
        s_googlePriceFeed = googlePriceFeed;
        s_microsoftPriceFeed = microsoftPriceFeed;
        i_owner = msg.sender;
        number = 5;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }

    function getApplePrice() public view returns (uint256) {
        (, int256 answer, , , ) = AggregatorV3Interface(s_applePriceFeed).latestRoundData();
        return uint256(answer);
    }

    function getGooglePrice() public view returns (uint256) {
        (, int256 answer, , , ) = AggregatorV3Interface(s_googlePriceFeed).latestRoundData();
        return uint256(answer);
    }

    function getMicrosoftPrice() public view returns (uint256) {
        (, int256 answer, , , ) = AggregatorV3Interface(s_microsoftPriceFeed).latestRoundData();
        return uint256(answer);
    }

    function createToken(
        address payable borrowerAddress,
        uint256 appleStocks,
        uint256 microsoftStocks,
        uint256 googleStocks
    ) public {
        EquityToken equityToken = new EquityToken(
            borrowerAddress,
            appleStocks,
            microsoftStocks,
            googleStocks,
            s_applePriceFeed,
            s_googlePriceFeed,
            s_microsoftPriceFeed,
            i_owner
        );
        personTokenMapping[borrowerAddress] = equityToken;
    }

    function getApplePrice(address borrowerAddress) internal view returns (uint256) {
        return personTokenMapping[borrowerAddress].getApplePrice();
    }

    function getGooglePrice(address borrowerAddress) internal view returns (uint256) {
        return personTokenMapping[borrowerAddress].getGooglePrice();
    }

    function getMicrosoftPrice(address borrowerAddress) internal view returns (uint256) {
        return personTokenMapping[borrowerAddress].getMicrosoftPrice();
    }

    function getValuation(address borrowerAddress) public view returns (uint256) {
        return personTokenMapping[borrowerAddress].getValuation();
    }

    function getOwner(address borrowerAddress) public view returns (address) {
        return personTokenMapping[borrowerAddress].getOwner();
    }

    function getBalance(address owner, address account) public view returns (uint256) {
        return personTokenMapping[owner].balanceOf(account);
    }

    function getToken(address borrowerAddress) public view returns (address) {
        EquityToken etoken = personTokenMapping[borrowerAddress];
        return address(etoken);
    }

    function getAllowance(address owner, address spender) public view returns (uint256) {
        return personTokenMapping[owner].allowance(owner, spender);
    }

    function getEquityCount(address borrowerAddress, string calldata equityName)
        public
        view
        returns (uint256)
    {
        return personTokenMapping[borrowerAddress].getEquityCount(equityName);
    }
}
