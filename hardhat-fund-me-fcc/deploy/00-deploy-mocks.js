const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull these functions out of deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
}
