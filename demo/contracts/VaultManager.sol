// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";
import "./Vault.sol";
import "hardhat/console.sol";

//get number of apple, microsoft, google stocks

contract VaultManager {
    mapping(address => Vault) public vaultTokenMapping;

    function createVault(address token) public {
        Vault vault = new Vault(
            address(token),
            EquityToken(token).getValuation(),
            payable(EquityToken(token).getBorrowerAddress())
        );
        vaultTokenMapping[EquityToken(token).getBorrowerAddress()] = vault;
    }

    function getValuation(address borrowerVault) public view returns (uint256) {
        return vaultTokenMapping[borrowerVault].getValuation();
    }

    function getVault(address borrowerVault) public view returns (address) {
        return address(vaultTokenMapping[borrowerVault]);
    }

    function getOwner(address borrowerVault) public view returns (address) {
        return vaultTokenMapping[borrowerVault].getOwner();
    }

    function getBorrowerAddress(address borrowerVault) public view returns (address) {
        return vaultTokenMapping[borrowerVault].getBorrowerAddress();
    }

    function liquidate(address borrowerVault) public payable {
        vaultTokenMapping[borrowerVault].liquidate();
    }

    function drawDai(address borrowerVault) public {
        vaultTokenMapping[borrowerVault].drawDai();
    }

    function getDaiBalance(address borrowerVault, address account) public view returns (uint256) {
        console.log("DAI");
        return vaultTokenMapping[borrowerVault].getDaiBalance(account);
    }
}
