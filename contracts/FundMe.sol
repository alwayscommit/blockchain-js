// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "@chainlink/contracts/src/v0.8/vendor/SafeMathChainLink.sol";


contract FundMe {
    //prevents overflow errors
    //using SafeMathChainLink for uint256;

    mapping(address => uint256) public addressAmountMap;
    address[] public funders;  
    address public owner;

    //called as soon as the contract is deployed - good place to initialize critical info like owner, no other person can call it.
    constructor() public {
        owner = msg.sender;
    }

    //https://docs.chain.link/

    function fund() public payable {
        //$50
        uint256 minUSD = 50 * 10**18; //gwei
        // if(msg.value < minUSD) {
            // revert
        // }

        //using require is better
        require(getConversionRate(msg.value) >= minUSD, "Spend more ETH!");
        addressAmountMap[msg.sender] = addressAmountMap[msg.sender] + msg.value;
        //since you cannot iterate over a mapping, you maintain an array of senders
        funders.push(msg.sender);
        // the ETH -> USD conversion rate
    }

    function getVersion() public view returns (uint256){
        //interfaces compile down to ABI - Application Binary Interface
        // ABI tells solidity and other programming languages how it can interact with another contract
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getPrice() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // tuple is list of objects of potentially different data types 
                // (
                //     uint80 roundId,
                //     int256 answer,
                //     uint256 startedAt,
                //     uint256 updatedAt,
                //     uint80 answeredInRound
                // ) = priceFeed.latestRoundData();

                 // to avoid the warnings of unused variables, because we only need price here,
                // we can return empty placeholders.
                (,int256 answer,,,) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);            
    }

    //1000000000
    function getConversionRate(uint256 ethAmount) public view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1000000000000000000;
        //0.000002078100000000
        //https://eth-converter.com/
        return ethAmountInUSD;
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