const { ethers, network } = require("hardhat")
const fs = require("fs")
const { getContractAddress } = require("ethers/lib/utils")

const FRONTEND_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/contractAddresses.json"
const FRONTEND_LOCATION_ABI_FILE = "../demo-frontend/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        updateContractAddresses()
        updateABI()
    }
}

async function updateABI() {
    const equityTokenManager = await ethers.getContract("EquityTokenManager")
    fs.writeFileSync(FRONTEND_LOCATION_ABI_FILE, JSON.stringify(equityTokenManager.interface))
}

async function updateContractAddresses() {
    const equityTokenManager = await ethers.getContract("EquityTokenManager")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(FRONTEND_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(equityTokenManager.address)) {
            contractAddresses[chainId].push(equityTokenManager.address)
        }
    }
    {
        contractAddresses[chainId] = [equityTokenManager.address]
    }
    fs.writeFileSync(FRONTEND_LOCATION_ADDRESSES_FILE, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
