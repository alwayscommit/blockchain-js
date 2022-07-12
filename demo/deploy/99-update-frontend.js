const { ethers, network } = require("hardhat")
const fs = require("fs")
const { getContractAddress } = require("ethers/lib/utils")

const EQUITY_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/equityContractAddress.json"
const EQUITY_LOCATION_ABI_FILE = "../demo-frontend/constants/equityABI.json"
const VAULT_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/vaultContractAddress.json"
const VAULT_LOCATION_ABI_FILE = "../demo-frontend/constants/vaultABI.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        updateContractAddresses()
        updateABI()
    }
}

async function updateABI() {
    const equityTokenManager = await ethers.getContract("EquityTokenManager")
    fs.writeFileSync(
        EQUITY_LOCATION_ABI_FILE,
        equityTokenManager.interface.format(ethers.utils.FormatTypes.json)
    )
    const vaultTokenManager = await ethers.getContract("VaultManager")
    fs.writeFileSync(
        VAULT_LOCATION_ABI_FILE,
        vaultTokenManager.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const equityTokenManager = await ethers.getContract("EquityTokenManager")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(VAULT_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(equityTokenManager.address)) {
            contractAddresses[chainId].push(equityTokenManager.address)
        }
    }
    {
        contractAddresses[chainId] = [equityTokenManager.address]
    }
    fs.writeFileSync(EQUITY_LOCATION_ADDRESSES_FILE, JSON.stringify(contractAddresses))

    const vaultTokenManager = await ethers.getContract("VaultManager")
    const vaultAddresses = JSON.parse(fs.readFileSync(VAULT_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in vaultAddresses) {
        if (!vaultAddresses[chainId].includes(vaultTokenManager.address)) {
            vaultAddresses[chainId].push(vaultTokenManager.address)
        }
    }
    {
        vaultAddresses[chainId] = [vaultTokenManager.address]
    }
    fs.writeFileSync(VAULT_LOCATION_ADDRESSES_FILE, JSON.stringify(vaultAddresses))
}

module.exports.tags = ["all", "frontend"]
