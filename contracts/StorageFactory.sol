// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//gives a choice on which contract to deploy
import "./SimpleStorage.sol";

contract StorageFactory {

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        //Address
        //ABI - Application Binary Interface

        // SimpleStorage simpleStorage = SimpleStorage(address(simpleStorageArray[_simpleStorageIndex]));
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        simpleStorage.store(_simpleStorageNumber);
    } 

     function sfGet(uint256 _simpleStorageIndex) public view returns (uint256) {
        //Address
        //ABI - Application Binary Interface

        return SimpleStorage(address(simpleStorageArray[_simpleStorageIndex])).retrieve();
    } 

}