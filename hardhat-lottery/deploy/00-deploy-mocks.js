const { getNamedAccounts, deployments, network, ethers } = require("hardhat")

// const BASE_FEE = "250000000000000000" // 0.25 is the premium in LINK, costs 0.25 LINK per request
const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1e9 // link per gas, price fluctuates based on the base chain,
//this is the price chainlink node has to pay to call our functions like performUpkeep, fulfillRandomWords

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const args = [BASE_FEE, GAS_PRICE_LINK]
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        //deploy mock contract for local chain
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
