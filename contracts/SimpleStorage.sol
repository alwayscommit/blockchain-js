// SPDX-License-Identifier: MIT

pragma solidity >0.6.0;

contract SimpleStorage{

    //external, public, private, internal (default, if not mentioned)

    uint256 number; //initialized to 0 by default
    // bool boolean = true;
    // string str = "String";
    // int256 negativeNumber = -2;
    // address addr = 0x4D1Acf49f1c7cCBC84A5FDd3120742F3C2151bAf;
    // bytes32 bytStr = 'cat';

    struct People {
        uint256 favNum;
        string name;
    }

    People[] public people; //dynamic array
    mapping(string => uint256) public nameNumberMap; //returns 0 (default value) if key not found

    People public person = People({favNum: 2, name: "aakash"});
    
    //
    function store(uint256 _favNum) public {
        number = _favNum;
    }

    //view functions - read only, view only
    //pure funcions - do some type of math
    //they don't really tansact on the blockchain
    function retrieve() public view returns (uint256) {
        return number;
    }

    //memory holds it only in memory, storage means keep it forever. 
    function addPerson(string memory _name, uint256 _favNum) public {
        // people.push(People({ name: _name, favNum: _favNum})); out of order mention the var name
        people.push(People(_favNum,_name)); //in order, can ignore
        nameNumberMap[_name] = _favNum;
    }

}