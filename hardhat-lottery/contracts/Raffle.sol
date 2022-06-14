// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

//Raffle
//Enter the lottery (paying some amount)
//Pick a random winner (verifiably random)
//Winner to be selected every X minutes -> completely automated
//Chainlink Oracle -> Randomness, Automated Execution, Chainlink Keepers

//Error codes
error Raffle__NotEnoughETHEntered();

contract Raffle {
    /* State Variables */
    uint256 private immutable i_entranceFee;
    //since we have to play the winner back, we make this payable
    address payable[] private s_players;

    constructor(uint256 entranceFee){
        i_entranceFee = entranceFee
    }


    //public because anyone can enter, payable because they'll have to send some ETH before they can enter the lottery
    function enterRaffle() public payable {
        // require(msg.value > i_entranceFee, "Not enough ETH!")
        // Because Strings are expensive, it is better to use Error Codes as they're stored as codes 
        if(msg.value < i_entranceFee){ revert Raffle__NotEnoughETHEntered();}
        //type cast this address because only payable addresses can be pushed to this array
        s_players.push(payable(msg.sender));
    }

    function pickRandomWinner() {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_players[index];
    }

    
}
