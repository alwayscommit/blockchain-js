// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";
import "./Dai.sol";
import "hardhat/console.sol";

contract Vault {
    //makerdao
    address private s_owner;
    ERC20 private s_token;
    uint256 private s_collateralValue;
    address payable private immutable i_borrowerAddress;
    address payable private constant makerDAOAddress =
        payable(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
    Dai private dai;

    // uint256 private debtValue;
    // uint256 private liquidationValue;

    constructor(
        address token,
        uint256 valuation,
        address payable borrowerAddress
    ) {
        s_token = ERC20(token);
        s_token.approve(makerDAOAddress, 1);
        //makerdao address
        s_owner = makerDAOAddress;
        s_collateralValue = valuation;
        i_borrowerAddress = borrowerAddress;
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }

    function getValuation() public view returns (uint256) {
        return s_collateralValue;
    }

    function getBorrowerAddress() public view returns (address) {
        return i_borrowerAddress;
    }

    function drawDai() public payable {
        s_token.transferFrom(i_borrowerAddress, makerDAOAddress, 1);
        dai = new Dai(s_collateralValue / 2, address(this), i_borrowerAddress);
        dai.transferFrom(makerDAOAddress, i_borrowerAddress, s_collateralValue / 2);
    }

    function liquidate() public payable {
        dai.burn(i_borrowerAddress, s_collateralValue / 2);
        s_token.transferFrom(makerDAOAddress, i_borrowerAddress, 1);
    }

    function getDaiBalance(address account) public view returns (uint256) {
        return dai.balanceOf(account);
    }
}
