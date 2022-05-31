// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <0.9.0;

import "./PriceConverter.sol";

//https://solidity-by-example.org/

// import "@chainlink/contracts/src/v0.8/vendor/SafeMathChainLink.sol";


contract FundMe {

    using PriceConverter for uint256; 

    //prevents overflow errors
    //using SafeMathChainLink for uint256;

    uint256 public minUSD = 50 * 1e18;

    mapping(address => uint256) public addressAmountMap;
    address[] public funders;  
    address public owner;

    //called as soon as the contract is deployed - good place to initialize critical info like owner, no other person can call it.
    constructor() public {
        owner = msg.sender;
    }

    //https://docs.chain.link/

    function fund() public payable {
        //require(msg.value > 1e18, "Didn't send enough ETH"); 1e18 == 1 x 10^18 or 1000000000000000000 

        //reverts the transaction where statements before this one are reverted and the remaining gas it sent back
        // require(getConversionRate(msg.value) >= minUSD, "Spend more ETH!");

        //this is possible because we've used a library, we can run those library functions on uint256 objects 
        //we don't pass any arguments because the object on when this function is called is considered as the first default paramter msg.value
        require(msg.value.getConversionRate() >= minUSD, "Spend more ETH!");
        addressAmountMap[msg.sender] = addressAmountMap[msg.sender] + msg.value;
        //since you cannot iterate over a mapping, you maintain an array of senders
        funders.push(msg.sender);
        // the ETH -> USD conversion rate
    }

    

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    //whoever is the message sender, withdraw funds back to their account
    function withdraw() payable onlyOwner public {
        payable(msg.sender).transfer(address(this).balance);
        //once people have funded the smart contract/project, we can withdraw everything and update their balances to 0
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressAmountMap[funder] = 0;
        }
        //empty the list of funders by creating a new array.
        funders = new address[](0);
    }



}