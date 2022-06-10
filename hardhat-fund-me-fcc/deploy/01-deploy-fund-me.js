//import
//main
//call main function

const { networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")

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

    const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]

    //when going for localhost or hardhat network we want to mock external dependencies like priceFeed
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], // put price feed address
    })
}
