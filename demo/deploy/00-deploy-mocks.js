const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull these functions out of deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("AppleMock", {
            contract: "AppleMock",
            from: deployer,
            log: true,
            args: [],
        })
        log("AppleMock deployed...")
        log("******************************************")
    }

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("GoogleMock", {
            contract: "GoogleMock",
            from: deployer,
            log: true,
            args: [],
        })
        log("GoogleMock deployed...")
        log("******************************************")
    }

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MicrosoftMock", {
            contract: "MicrosoftMock",
            from: deployer,
            log: true,
            args: [],
        })
        log("MicrosoftMock deployed...")
        log("******************************************")
    }
}

module.exports.tags = ["all", "mocks"]
