//import
//main
//call main function

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull these functions out of deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let appleMockAddress, googlePriceFeed, microsoftPriceFeed
    //if it includes hardhat or localhost (if we're testing locally, then you must mock)
    if (developmentChains.includes(network.name)) {
        const appleMock = await deployments.get("AppleMock")
        appleMockAddress = appleMock.address
        const googleMock = await deployments.get("GoogleMock")
        googleMockAddress = googleMock.address
        const microsoftMock = await deployments.get("MicrosoftMock")
        microsoftMockAddress = microsoftMock.address
    } else {
        appleMockAddress = networkConfig[chainId]["applePriceFeed"]
        googleMockAddress = networkConfig[chainId]["googlePriceFeed"]
        microsoftMockAddress = networkConfig[chainId]["microsoftPriceFeed"]
    }

    //when going for localhost or hardhat network we want to mock external dependencies like priceFeed
    const args = [appleMockAddress, googleMockAddress, microsoftMockAddress]
    const fundMe = await deploy("EquityTokenManager", {
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

    const args1 = []
    const vault = await deploy("VaultManager", {
        from: deployer,
        args: args1,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("VaultManager deployed...")
    log("******************************************")
}

module.exports.tags = ["all", "fundme"]
