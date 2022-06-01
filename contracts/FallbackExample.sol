// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FallbackExample {
    uint256 public result;

    //default function called 
    receive() external payable {
        result = 1;
    }

    fallback() external payable {
        result = 2; 
    }

}