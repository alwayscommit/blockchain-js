import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

//if we write connect() here, that'd actually be a method call and incorrect
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBorrowerUUID
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Hi, Metamask!")
    await window.ethereum.request({ method: "eth_requestAccounts" })
    console.log("Account Connected!")

    connectButton.innerHTML = "Connected!"
  } else {
    console.log("No Metamask")
    fundButton.innerHTML = "Please connect your Metamask!"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    //provider, connection to the blockchain
    //working with ethers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //signer, wallet, someone with some gas
    const signer = provider.getSigner()
    console.log(signer)
    //contract that we are interacting with
    const contract = new ethers.Contract(contractAddress, abi, signer) //we'll need to know the abi and the address of the contract
    //address is stored in constants file
    //ABI & address

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      //wait for this fund transaction to finish
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch (error) {
      console.log(error)
    }
  }
}

//javascript async
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)

  //create a listener, listen to the transaction to finish
  //gets added on the event loop and frontend periodically checks in if it is finished
  //but we want this piece of code to finish before we say transaction done.

  //resolves if the transaction completes, reject if the listener takes too long to execute
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })

  //finish this function only if the promise is resolved, otherwise wait for the transaction to be rejected,
  //add a reject timer
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

async function getBorrowerUUID() {
  console.log("hi")
  if (typeof window.ethereum != "undefined") {
    console.log("hi")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const transactionResponse = await contract.getBorrowerName()
      console.log(transactionResponse)
    } catch (error) {}
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    console.log("Withdrawing...")
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {}
  }
}
