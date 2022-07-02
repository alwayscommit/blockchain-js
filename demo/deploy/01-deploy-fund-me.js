//import
//main
//call main function

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull these functions out of deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let applePriceFeed
    //if it includes hardhat or localhost (if we're testing locally, then you must mock)
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("AppleMock")
        applePriceFeed = ethUSDAggregator.address
    } else {
        applePriceFeed = networkConfig[chainId]["applePriceFeed"]
    }

    //when going for localhost or hardhat network we want to mock external dependencies like priceFeed
    const args = []
    const fundMe = await deploy("EquityTokenFactory", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //   if (
    //     !developmentChains.includes(network.name) &&
    //     process.env.ETHERSCAN_API_KEY
    //   ) {
    //     await verify(fundMe.address, args);
    //   }

    log("EquityTokenFactory deployed...")
    log("******************************************")
}

module.exports.tags = ["all", "fundme"]
