// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

//Raffle
//Enter the lottery (paying some amount)
//Pick a random winner (verifiably random)
//Winner to be selected every X minutes -> completely automated
//Chainlink Oracle -> Randomness, Automated Execution, Chainlink Keepers

//Error codes
error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__NotOpen();
error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /* State Variables */
    uint256 private immutable i_entranceFee;
    //since we have to play the winner back, we make this payable
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit; //prevent from spending too much gas
    uint32 private constant NUM_WORDS = 1; //how many words do we want
    uint256 private s_lastTimestamp;
    uint256 private immutable i_interval;

    //lottery variables
    address private s_recentWinner;
    //keeping track of states
    RaffleState private s_raffleState;

    //Events, //TODO what is the point of indexed in events?
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winnner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimestamp = block.timestamp;
        i_interval = interval;
    }

    //public because anyone can enter, payable because they'll have to send some ETH before they can enter the lottery
    function enterRaffle() public payable {
        // require(msg.value > i_entranceFee, "Not enough ETH!")
        // Because Strings are expensive, it is better to use Error Codes as they're stored as codes
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }
        //type cast this address because only payable addresses can be pushed to this array
        s_players.push(payable(msg.sender));

        //events, naming convention - reverse the name of the function
        emit RaffleEnter(msg.sender);
    }

    //external functions are a little cheaper than public functions because solidity knows our contract can't call it
    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        //request random number, once we get it, do something with it.
        //2 transaction process - better because one transaction would enable brute force and simulate calling manipulation
        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //gasLane - max gas price you are willing to pay for a request in wei
            i_subscriptionId,
            REQUEST_CONFIRMATIONS, //requestConfirmations
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    //virtual function means that it should be overridden. This function is a part of VRFConsumerBaseV2
    function fulfillRandomWords(
        uint256, /*requiestId*/
        uint256[] memory randomWords
    ) internal override {
        //modulo operation, s_players size 10, random number is 202
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimestamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /**
     *TODO what is calldata used for
     * @dev this function that the chainlink keeper nodes call, they look for
     * the "upkeepNeeded" to return true.
     * For it to be true, time interval should have passed
     * lottery should have at least one player and have some ETH
     * subscription is funded with LINK
     * lottery should be in an "OPEN" state
     */
    function checkUpkeep(
        bytes memory /*checkdata*/ //calldata doesn't work with strings
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData - can be used do some other stuff depending on how the upkeep went */
        )
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimestamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    //view, pure functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    //since num_words is in the bytecode, stored as a constant, it isn't reading from storage
    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimestamp() public view returns (uint256) {
        return s_lastTimestamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}
