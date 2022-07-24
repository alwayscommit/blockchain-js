import { useWeb3Contract } from "react-moralis"
import {
    equityABI,
    vaultABI,
    vaultContractAddress,
    equityContractAddress,
    equityTokenABI,
    appleABI,
    appleAddress,
    googleABI,
    googleAddress,
    microsoftABI,
    microsoftAddress,
} from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function EquityLoan() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const equityLoanAddress =
        chainId in equityContractAddress ? equityContractAddress[chainId][0] : null
    const vaultAddress = chainId in vaultContractAddress ? vaultContractAddress[chainId][0] : null
    const appleAddr = chainId in appleAddress ? appleAddress[chainId][0] : null
    const googleAddr = chainId in googleAddress ? googleAddress[chainId][0] : null
    const microsoftAddr = chainId in microsoftAddress ? microsoftAddress[chainId][0] : null

    const [apple, setApple] = useState("")
    const [google, setGoogle] = useState("")
    const [microsoft, setMicrosoft] = useState("")
    const [newBorrowerId, setNewBorrowerId] = useState("")
    const [borrowerId, setBorrowerId] = useState("")
    const [valuation, setValuation] = useState("")
    const [applePrice, setApplePrice] = useState("")
    const [googlePrice, setGooglePrice] = useState("")
    const [microsoftPrice, setMicrosoftPrice] = useState("")
    const [equityToken, setEquityToken] = useState("")
    const [vault, setVault] = useState("")
    const [borrowerDai, setBorrowerDai] = useState("0")
    const [borrowerEquity, setBorrowerEquity] = useState("0")
    const [makerAddress, setMakerAddress] = useState("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    const [makerEquity, setMakerEquity] = useState("0")

    const { runContractFunction: createToken } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "createToken",
        params: {
            borrowerAddress: newBorrowerId,
            appleStocks: apple,
            microsoftStocks: microsoft,
            googleStocks: google,
        },
    })

    const { runContractFunction: createVault } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "createVault",
        params: {
            token: equityToken,
        },
    })

    const { runContractFunction: approve } = useWeb3Contract({
        abi: equityTokenABI,
        contractAddress: equityToken,
        functionName: "approve",
        params: {
            spender: vault,
            amount: 1,
        },
    })

    const { runContractFunction: drawDai } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "drawDai",
        params: {
            borrowerVault: borrowerId,
        },
    })

    const { runContractFunction: getBorrowerDai } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "getDaiBalance",
        params: { borrowerVault: borrowerId, account: borrowerId },
    })

    const { runContractFunction: getMakerDai } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "getDaiBalance",
        params: { borrowerVault: borrowerId, account: makerAddress },
    })

    const { runContractFunction: getValuation } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getValuation",
        params: {
            borrowerAddress: borrowerId,
        },
    })

    const { runContractFunction: getApplePrice } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getApplePrice",
        params: {},
    })

    const { runContractFunction: getGooglePrice } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getGooglePrice",
        params: {},
    })

    const { runContractFunction: getMicrosoftPrice } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getMicrosoftPrice",
        params: {},
    })

    const { runContractFunction: getToken } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getToken",
        params: { borrowerAddress: borrowerId },
    })

    const { runContractFunction: getBorrowerEqBalance } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getBalance",
        params: { owner: borrowerId, account: borrowerId },
    })

    const { runContractFunction: getMakerEqBalance } = useWeb3Contract({
        abi: equityABI,
        contractAddress: equityLoanAddress,
        functionName: "getBalance",
        params: { owner: borrowerId, account: makerAddress },
    })

    const { runContractFunction: getVault } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "getVault",
        params: { borrowerVault: borrowerId },
    })

    const { runContractFunction: liquidate } = useWeb3Contract({
        abi: vaultABI,
        contractAddress: vaultAddress,
        functionName: "liquidate",
        params: { borrowerVault: borrowerId },
    })

    const { runContractFunction: updateApple } = useWeb3Contract({
        abi: appleABI,
        contractAddress: appleAddr,
        functionName: "updateAnswer",
        params: { _answer: 79 },
    })

    const { runContractFunction: updateGoogle } = useWeb3Contract({
        abi: googleABI,
        contractAddress: googleAddr,
        functionName: "updateAnswer",
        params: { _answer: 1187 },
    })

    const { runContractFunction: updateMicrosoft } = useWeb3Contract({
        abi: microsoftABI,
        contractAddress: microsoftAddr,
        functionName: "updateAnswer",
        params: { _answer: 140 },
    })

    async function updateUIValues() {
        const appleValue = (await getApplePrice()).toString()
        const googleValue = (await getGooglePrice()).toString()
        const microsoftValue = (await getMicrosoftPrice()).toString()
        setApplePrice(appleValue)
        setMicrosoftPrice(microsoftValue)
        setGooglePrice(googleValue)
    }

    async function getBalances() {
        const borrowerDaiVal = (await getBorrowerDai()).toString()
        setBorrowerDai(borrowerDaiVal)
        const borrowerEqVal = (await getBorrowerEqBalance()).toString()
        setBorrowerEquity(borrowerEqVal)
        const makerEqVal = (await getMakerEqBalance()).toString()
        setMakerEquity(makerEqVal)
    }

    async function updateStockPrices() {
        await updateApple()
        await updateGoogle()
        await updateMicrosoft()
        updateUIValues()
    }

    async function getBorrowerEq() {
        const borrowerEqVal = (await getBorrowerEqBalance()).toString()
        setBorrowerEquity(borrowerEqVal)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Hi from Equity Loans!
            {equityLoanAddress ? (
                <div>
                    <input
                        type="text"
                        value={newBorrowerId}
                        placeholder="Enter Borrower Address"
                        onChange={(e) => {
                            setNewBorrowerId(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={apple}
                        placeholder="Apple Stocks"
                        onChange={(e) => {
                            setApple(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={google}
                        placeholder="Google Stocks"
                        onChange={(e) => {
                            setGoogle(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={microsoft}
                        placeholder="Microsoft Stocks"
                        onChange={(e) => {
                            setMicrosoft(e.currentTarget.value)
                        }}
                    />
                    <button
                        onClick={async function () {
                            await createToken()
                        }}
                    >
                        Tokenize Borrower's Equity Portfolio
                    </button>
                    <br></br>
                    <input
                        type="text"
                        value={borrowerId}
                        placeholder="Enter Borrower Address"
                        onChange={(e) => {
                            setBorrowerId(e.currentTarget.value)
                        }}
                    />
                    <button
                        onClick={async function () {
                            let currentValue = (await getValuation()).toString()
                            setValuation(currentValue)
                        }}
                    >
                        Valuate Portfolio &nbsp;
                    </button>{" "}
                    Current Valuation : {valuation} &nbsp;
                    <button
                        onClick={async function () {
                            let token = (await getToken()).toString()
                            setEquityToken(token)
                        }}
                    >
                        Borrower's Equity Token
                    </button>{" "}
                    Token Address : {equityToken}
                    <br></br>
                    <br></br>
                    <input
                        type="text"
                        value={equityToken}
                        placeholder="Enter Equity Token Address"
                    />
                    <button
                        onClick={async function () {
                            await createVault()
                        }}
                    >
                        Deposit Equity Portfolio in Vault &nbsp;
                    </button>{" "}
                    &nbsp;
                    <button
                        onClick={async function () {
                            console.log(borrowerId)
                            let vault = (await getVault()).toString()
                            setVault(vault)
                        }}
                    >
                        Borrower's Vault
                    </button>{" "}
                    Vault Address : {vault}
                    <br></br>
                    <br></br>
                    <button
                        onClick={async function () {
                            await drawDai()
                        }}
                    >
                        Draw DAI Token
                    </button>
                    <br></br>
                    <br></br>
                    <button
                        onClick={async function () {
                            await getBorrowerEq()
                        }}
                    >
                        Get Borrower Equity Balance
                    </button>
                    &nbsp;
                    <button
                        onClick={async function () {
                            await getBalances()
                        }}
                    >
                        Get Balances
                    </button>
                    <br />
                    Borrower's DAI Balance : {borrowerDai}
                    <br />
                    Borrower's Equity Balance : {borrowerEquity}
                    <br />
                    MakerDAO's Equity Balance : {makerEquity}
                    <br></br>
                    <br></br>
                    <button
                        onClick={async function () {
                            await liquidate()
                        }}
                    >
                        Liquidate
                    </button>
                    <br></br>
                    <br></br>
                    <button
                        onClick={async function () {
                            await approve()
                        }}
                    >
                        Approve Token Exchange between Borrower and MakerDAO
                    </button>{" "}
                </div>
            ) : (
                <div>No Equity Contract Detected</div>
            )}
            <div>
                <br></br>
                <button
                    onClick={async function () {
                        await updateStockPrices()
                    }}
                >
                    Update Stock Prices
                </button>
                <br />
                <br />
                <b>Current Stock Prices</b>
                <br />
                Apple Stock Value : {applePrice}
                <br />
                Google Stock Value : {googlePrice}
                <br />
                Microsoft Stock Value : {microsoftPrice}
                <br />
            </div>
        </div>
    )
}
