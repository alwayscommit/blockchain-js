// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error EquityToken__NotOwner();

contract EquityToken is ERC20 {
    //owner = centralized entity
    address private immutable i_owner;
    //unique id of the person who wants to borrow DAI through this centralized entity
    // uint256 private immutable i_borrowerUUID;
    address payable private s_borrowerAddress;
    mapping(string => uint256) s_stockPortfolio;
    AggregatorV3Interface private s_applePriceFeed;
    AggregatorV3Interface private s_googlePriceFeed;
    AggregatorV3Interface private s_microsoftPriceFeed;

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert EquityToken__NotOwner();
        }
        _;
    }

    constructor(
        // uint256 borrowerUUID,
        address payable borrowerAddress,
        uint256 appleStocks,
        uint256 microsoftStocks,
        uint256 googleStocks,
        address applePriceFeed,
        address googlePriceFeed,
        address microsoftPriceFeed,
        address owner
    ) ERC20("EquityToken", "EQT") {
        i_owner = owner;
        s_stockPortfolio["APPLE"] = appleStocks;
        s_stockPortfolio["MICROSOFT"] = microsoftStocks;
        s_stockPortfolio["GOOGLE"] = googleStocks;
        s_borrowerAddress = borrowerAddress;
        s_applePriceFeed = AggregatorV3Interface(applePriceFeed);
        s_googlePriceFeed = AggregatorV3Interface(googlePriceFeed);
        s_microsoftPriceFeed = AggregatorV3Interface(microsoftPriceFeed);
        _mint(s_borrowerAddress, 1);
    }

    function getApplePrice() internal view returns (uint256) {
        (, int256 answer, , , ) = s_applePriceFeed.latestRoundData();
        return uint256(answer);
    }

    function getGooglePrice() internal view returns (uint256) {
        (, int256 answer, , , ) = s_googlePriceFeed.latestRoundData();
        return uint256(answer);
    }

    function getMicrosoftPrice() internal view returns (uint256) {
        (, int256 answer, , , ) = s_microsoftPriceFeed.latestRoundData();
        return uint256(answer);
    }

    // function getBorrowerUUID() public view returns (uint256) {
    // return i_borrowerUUID;
    // }

    function getBorrowerAddress() public view returns (address) {
        return s_borrowerAddress;
    }

    function getValuation() public view returns (uint256) {
        return
            (getApplePrice() * s_stockPortfolio["APPLE"]) +
            (getGooglePrice() * s_stockPortfolio["GOOGLE"]) +
            (getMicrosoftPrice() * s_stockPortfolio["MICROSOFT"]);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getEquityCount(string calldata equityName) public view returns (uint256) {
        return s_stockPortfolio[equityName];
    }
}
