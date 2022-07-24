const { ethers, network } = require("hardhat")
const fs = require("fs")
const { getContractAddress } = require("ethers/lib/utils")

const EQUITY_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/equityContractAddress.json"
const EQUITY_LOCATION_ABI_FILE = "../demo-frontend/constants/equityABI.json"
const VAULT_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/vaultContractAddress.json"
const VAULT_LOCATION_ABI_FILE = "../demo-frontend/constants/vaultABI.json"
const APPLE_LOCATION_ABI_FILE = "../demo-frontend/constants/appleABI.json"
const GOOGLE_LOCATION_ABI_FILE = "../demo-frontend/constants/googleABI.json"
const MICROSOFT_LOCATION_ABI_FILE = "../demo-frontend/constants/microsoftABI.json"
const APPLE_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/appleAddress.json"
const GOOGLE_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/googleAddress.json"
const MICROSOFT_LOCATION_ADDRESSES_FILE = "../demo-frontend/constants/microsoftAddress.json"

const SAMPLE_LOCATION_ABI_FILE = "../demo-frontend/constants/equityTokenABI.json"

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

    const equityToken = await ethers.getContract("EquityToken")
    fs.writeFileSync(
        SAMPLE_LOCATION_ABI_FILE,
        equityToken.interface.format(ethers.utils.FormatTypes.json)
    )

    const appleMock = await ethers.getContract("AppleMock")
    fs.writeFileSync(
        APPLE_LOCATION_ABI_FILE,
        appleMock.interface.format(ethers.utils.FormatTypes.json)
    )

    const googleMock = await ethers.getContract("GoogleMock")
    fs.writeFileSync(
        GOOGLE_LOCATION_ABI_FILE,
        googleMock.interface.format(ethers.utils.FormatTypes.json)
    )

    const microsoftMock = await ethers.getContract("MicrosoftMock")
    fs.writeFileSync(
        MICROSOFT_LOCATION_ABI_FILE,
        microsoftMock.interface.format(ethers.utils.FormatTypes.json)
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

    const appleMock = await ethers.getContract("AppleMock")
    const appleAddress = JSON.parse(fs.readFileSync(APPLE_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in appleAddress) {
        if (!appleAddress[chainId].includes(appleMock.address)) {
            appleAddress[chainId].push(appleMock.address)
        }
    }
    {
        appleAddress[chainId] = [appleMock.address]
    }
    fs.writeFileSync(APPLE_LOCATION_ADDRESSES_FILE, JSON.stringify(appleAddress))

    const googleMock = await ethers.getContract("GoogleMock")
    const googleAddress = JSON.parse(fs.readFileSync(GOOGLE_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in googleAddress) {
        if (!googleAddress[chainId].includes(googleMock.address)) {
            googleAddress[chainId].push(googleMock.address)
        }
    }
    {
        googleAddress[chainId] = [googleMock.address]
    }
    fs.writeFileSync(GOOGLE_LOCATION_ADDRESSES_FILE, JSON.stringify(googleAddress))

    const microsoftMock = await ethers.getContract("MicrosoftMock")
    const microsoftAddress = JSON.parse(fs.readFileSync(MICROSOFT_LOCATION_ADDRESSES_FILE, "utf8"))
    if (chainId in microsoftAddress) {
        if (!microsoftAddress[chainId].includes(microsoftMock.address)) {
            microsoftAddress[chainId].push(microsoftMock.address)
        }
    }
    {
        microsoftAddress[chainId] = [microsoftMock.address]
    }
    fs.writeFileSync(MICROSOFT_LOCATION_ADDRESSES_FILE, JSON.stringify(microsoftAddress))
}

module.exports.tags = ["all", "frontend"]
