// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {
    // overriding
    // virtual, override

    function store(uint256 _favNum) public override {
        number = _favNum + 5;
    }



}