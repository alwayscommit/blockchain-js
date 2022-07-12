import { useWeb3Contract } from "react-moralis"
import { equityABI, vaultABI, vaultContractAddress, equityContractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function EquityLoan() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const equityLoanAddress =
        chainId in equityContractAddress ? equityContractAddress[chainId][0] : null

    const [apple, setApple] = useState("")
    const [google, setGoogle] = useState("")
    const [microsoft, setMicrosoft] = useState("")
    const [newBorrowerId, setNewBorrowerId] = useState("")
    const [borrowerId, setBorrowerId] = useState("")
    const [valuation, setValuation] = useState("")
    const [applePrice, setApplePrice] = useState("")
    const [googlePrice, setGooglePrice] = useState("")
    const [microsoftPrice, setMicrosoftPrice] = useState("")

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

    async function updateUIValues() {
        const appleValue = (await getApplePrice()).toString()
        const googleValue = (await getGooglePrice()).toString()
        const microsoftValue = (await getMicrosoftPrice()).toString()
        setApplePrice(appleValue)
        setMicrosoftPrice(microsoftValue)
        setGooglePrice(googleValue)
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
                        Deposit Equity
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
                        Get Valuation
                    </button>
                    <bR></bR>Current Valuation : {valuation}
                </div>
            ) : (
                <div>No Equity Contract Detected</div>
            )}
            <div>
                <br />
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
