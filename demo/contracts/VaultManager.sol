// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

import "./EquityToken.sol";
import "./Vault.sol";

//get number of apple, microsoft, google stocks

contract VaultManager {
    mapping(address => Vault) public vaultTokenMapping;

    function createVault(EquityToken token) public {
        Vault vault = new Vault(
            address(token),
            token.getValuation(),
            payable(token.getBorrowerAddress())
        );
        vaultTokenMapping[token.getBorrowerAddress()] = vault;
    }

    function getValuation(address borrowerVault) public view returns (uint256) {
        return vaultTokenMapping[borrowerVault].getValuation();
    }

    function getOwner(address borrowerVault) public view returns (address) {
        return vaultTokenMapping[borrowerVault].getOwner();
    }

    function getBorrowerAddress(address borrowerVault) public view returns (address) {
        return vaultTokenMapping[borrowerVault].getBorrowerAddress();
    }

    function drawDai(address borrowerVault) public {
        vaultTokenMapping[borrowerVault].drawDai();
    }

    function getBalance(address borrowerVault, address account) public view returns (uint256) {
        return vaultTokenMapping[borrowerVault].getBalance(account);
    }
}
