//import
//main
//call main function

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//1. a way to deploy
// function deployFunc() {
//     console.log("hi")
// }
// module.exports.default = deployFunc

//2. another way
// module.exports = async (hre) => {
// const {getNamedAccounts, deployments} = hre
//instead of hre.getNamedAccounts
//and hre.deployments
// }

//but we could just, async nameless function
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull these functions out of deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUSDPriceFeedAddress
    //if it includes hardhat or localhost (if we're testing locally, then you must mock)
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeedAddress = ethUSDAggregator.address
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]
    }

    //when going for localhost or hardhat network we want to mock external dependencies like priceFeed
    const args = [ethUSDPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("Fund-Me deployed...")
    log("******************************************")
}

module.exports.tags = ["all", "fundme"]
