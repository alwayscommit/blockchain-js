// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <0.9.0;

import "./PriceConverter.sol";

//https://solidity-by-example.org/

// import "@chainlink/contracts/src/v0.8/vendor/SafeMathChainLink.sol";

error NotOwner(); 

contract FundMe {

    using PriceConverter for uint256; 

    //prevents overflow errors
    //using SafeMathChainLink for uint256;

    //constant - variables can't be changed, doesn't take storage spot, saves gas, saves approx 19000 gas
    // 21,415 gas - constant
    // 23,515 gas - non-constant
    // 21,415 * 141000000000 (gas in wei) =  9.05 dollars
    // 23,515 * 141000000000 (gas in wei) = 9.94 dollars (costs almost a dollar more if we don't use constants where necessary)
    uint256 public constant MIN_USD = 50 * 10 ** 18;

    mapping(address => uint256) public addressAmountMap;
    address[] public funders;
    //set only once so we can mark it as immutable, saves gas similar to constants
    address public immutable i_owner;

    //called as soon as the contract is deployed - good place to initialize critical info like owner, no other person can call it.
    constructor() {
        i_owner = msg.sender;
    }

    //https://docs.chain.link/

    function fund() public payable {
        //require(msg.value > 1e18, "Didn't send enough ETH"); 1e18 == 1 x 10^18 or 1000000000000000000 

        //reverts the transaction where statements before this one are reverted and the remaining gas it sent back
        // require(getConversionRate(msg.value) >= minUSD, "Spend more ETH!");

        //this is possible because we've used a library, we can run those library functions on uint256 objects 
        //we don't pass any arguments because the object on when this function is called is considered as the first default paramter msg.value
        require(msg.value.getConversionRate() >= MIN_USD, "Spend more ETH!");
        addressAmountMap[msg.sender] = addressAmountMap[msg.sender] + msg.value;
        //since you cannot iterate over a mapping, you maintain an array of senders
        funders.push(msg.sender);
        // the ETH -> USD conversion rate
    }

    modifier onlyOwner{
        //require(msg.sender == i_owner, "Sender is not owner");
        //custom errors are more gas efficient
        if(msg.sender != i_owner){revert NotOwner();}
        _;
    }
    // _; - represents the rest of the code of the function where this modifier is being used, the position of _; matters

    //whoever is the message sender, withdraw funds back to their account
    function withdraw() payable onlyOwner public {
        //cast to payable address
        //msg.sender = address
        
        //transfer
        //payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);


        //send
        //transfer automatically reverts the transaction whereas send function needs extra handling
        bool isSuccess = payable(msg.sender).send(address(this).balance);
        require(isSuccess, "Send failed!");


        //call - lower level command, can be used to call any function in Ethereum without the ABI
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed!");

        //transfer - 2300 gas, throws error
        //send - 2300 gas, returns bool
        //call - forward all gas or set gas, returns bool (recommended way)

        //once people have funded the smart contract/project, we can withdraw everything and update their balances to 0
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressAmountMap[funder] = 0;
        }
        //empty the list of funders by creating a new array.
        funders = new address[](0);
    }


    // receive, fallback special functions
    // even if someone sends money instead of using the fund function, this contract will still process it
    receive() external payable {
        fund();
    }

    fallback() external payable{
        fund();
    }
}