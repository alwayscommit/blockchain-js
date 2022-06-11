const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator

    beforeEach(async function () {
        //deploy FundMe contract
        // using Hardhat-deploy

        //another way to get different accounts, ethers.getSigners() returns whatever is there in the accounts section of the network in hardhat.config.js
        //for default hardhat network, it returns a list of 10 addresses.
        const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]

        //hre has these getNamedAccounts and deployments functionalities that we can use
        deployer = (await getNamedAccounts()).deployer

        //fixture allows us to run scripts with these tags
        await deployments.fixture(["all"])

        //hardhat deploy wraps ethers with getContract function
        //getContract gets the latest deployed contract of FundMe
        //we pass "deployer" here because whenever we run any function
        //on the FundMe contract, it will get run using this deployer account
        fundMe = await ethers.getContract("FundMe", deployer)

        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the v3 aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to fund more ETH!"
            )
        })
    })
})
