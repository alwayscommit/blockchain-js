const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //ETH to wei representation

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
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to fund more ETH!"
            )
        })
        it("updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressAmount(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("updates adds funder to array of getFunder", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response.toString(), deployer)
        })
    })

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single founder", async function () {
            //arrange
            //get starting balance of the deployer and the contract
            //here we could even do ethers.provider.getBalance(fundMe.address)
            //but here we used provider of the fundMe contract, doesn't really matter
            //we want to use the getBalance() function of the provider object that gets
            //the balance of any contract
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //act

            const transactionResponse = await fundMe.withdraw()
            //wait till the transaction completes and then check whether all the contract balance is
            //send to the owner's address
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                //BigNumber.add() function is better to perform math operations, makes it easier
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows us to withdraw with multiple getFunder", async function () {
            const accounts = await ethers.getSigners()
            //0 index is for the deployer
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                //BigNumber.add() function is better to perform math operations, makes it easier
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )

            //make sure that getFunder are reset properly
            //since the getFunder array should be empty, looking for an element at 0 index should throw an error
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressAmount(accounts[i].address),
                    0
                )
            }
        })

        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })
    })

    describe("cheapWithdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single founder", async function () {
            //arrange
            //get starting balance of the deployer and the contract
            //here we could even do ethers.provider.getBalance(fundMe.address)
            //but here we used provider of the fundMe contract, doesn't really matter
            //we want to use the getBalance() function of the provider object that gets
            //the balance of any contract
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //act

            const transactionResponse = await fundMe.cheaperWithdraw()
            //wait till the transaction completes and then check whether all the contract balance is
            //send to the owner's address
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                //BigNumber.add() function is better to perform math operations, makes it easier
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows us to withdraw with multiple getFunder", async function () {
            const accounts = await ethers.getSigners()
            //0 index is for the deployer
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                //BigNumber.add() function is better to perform math operations, makes it easier
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )

            //make sure that getFunder are reset properly
            //since the getFunder array should be empty, looking for an element at 0 index should throw an error
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressAmount(accounts[i].address),
                    0
                )
            }
        })

        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })
    })
})
