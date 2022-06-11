// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.0;

//imports
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
//hardhat has console.log()
// import "hardhat/console.sol";

//Error Codes, best practice to include contract name to not be confused between different error codes
error FundMe__NotOwner();

//Interfaces, Libraries, Contracts

/** @title A contract for crowd funding
 *  @author alwayscommit
 *  @notice Sample crowd funding contract
 *  @dev Implements price feeds for our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint256 public constant MIN_USD = 50 * 10**18;

    //s_storageVariables
    mapping(address => uint256) public s_addressAmountMap;
    address[] public s_funders;
    address public immutable i_owner;
    AggregatorV3Interface public s_priceFeed;

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    //contructor
    //receive
    //fallback
    //external
    //public
    //internal
    //private
    //view/pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     *  @notice Funds this contract
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
            "You need to fund more ETH!"
        );
        s_addressAmountMap[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        bool isSuccess = payable(msg.sender).send(address(this).balance);
        require(isSuccess, "Send failed!");
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "Call failed!");
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressAmountMap[funder] = 0;
        }
        s_funders = new address[](0);
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        //mappings can't be in memory
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressAmountMap[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }
}
