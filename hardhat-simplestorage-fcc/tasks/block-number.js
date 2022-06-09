const { task } = require("hardhat/config")

//tasks can be used as command line functions that can be directly called
//they're similar to scripts but scripts have to be run from a .js file
task("block-number", "Prints the current block number").setAction(
  //anonymous function
  //const blockTask = async function () => {}
  //async function blockTask() {}
  //hre=hardhat runtime environment
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current Block Number: ${blockNumber}`)
  }
)

module.exports = {}
