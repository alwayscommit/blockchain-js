import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function EquityLoan() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const equityLoanAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [apple, setApple] = useState("")
    const [google, setGoogle] = useState("")
    const [microsoft, setMicrosoft] = useState("")
    const [newBorrowerId, setNewBorrowerId] = useState("")
    const [borrowerId, setBorrowerId] = useState("")
    const [valuation, setValuation] = useState("")
    const [something, setSomething] = useState("")

    const { runContractFunction: createToken } = useWeb3Contract({
        abi: abi,
        contractAddress: equityLoanAddress,
        functionName: "createToken",
        params: {
            _borrowerUUID: newBorrowerId,
            appleStocks: apple,
            microsoftStocks: microsoft,
            googleStocks: google,
        },
    })

    const { runContractFunction: getValuation } = useWeb3Contract({
        abi: abi,
        contractAddress: equityLoanAddress,
        functionName: "getValuation",
        params: {
            _borrowerUUID: borrowerId,
        },
    })

    const { runContractFunction: getNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: equityLoanAddress,
        functionName: "getNumber",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const someNumber = (await getNumber()).toString()
                setSomething(someNumber)
            }
            updateUI()
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
                        placeholder="Enter Borrower ID"
                        onChange={(e) => {
                            setNewBorrowerId(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={apple}
                        placeholder="No. of Apple Stocks"
                        onChange={(e) => {
                            setApple(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={google}
                        placeholder="No. of Google Stocks"
                        onChange={(e) => {
                            setGoogle(e.currentTarget.value)
                        }}
                    />
                    <input
                        type="text"
                        value={microsoft}
                        placeholder="No. of Microsoft Stocks"
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
                        placeholder="Enter Borrower ID"
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
                    Current Valuation : {valuation}
                </div>
            ) : (
                <div>No Equity Contract Detected</div>
            )}
            <div>
                <br />
                <br />
                <br />
                <br />
                Update Stocks Mock Value
            </div>
        </div>
    )
}
