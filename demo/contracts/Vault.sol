// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";
import "./Dai.sol";

contract Vault {
    //makerdao
    address private s_owner;
    ERC20 private s_token;
    uint256 private s_collateralValue;
    address payable private immutable i_borrowerAddress;
    address payable private constant makerDAOAddress =
        payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);
    Dai private dai;

    // uint256 private debtValue;
    // uint256 private liquidationValue;

    constructor(
        address token,
        uint256 valuation,
        address payable borrowerAddress
    ) {
        s_token = ERC20(token);
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

    function transferEquity() public payable {
        s_token.transferFrom(i_borrowerAddress, makerDAOAddress, 1);
        dai = new Dai(s_collateralValue / 2, address(this));
        dai.transferFrom(makerDAOAddress, i_borrowerAddress, s_collateralValue / 2);
    }

    function getDaiBalance(address account) public view returns (uint256) {
        return dai.balanceOf(account);
    }
}
