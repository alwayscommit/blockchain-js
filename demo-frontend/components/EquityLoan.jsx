import { useWeb3Contract } from "react-moralis"

export default function EquityLoan() {

    const {runContractFunction: createToken} = useWeb3Contract({
        abi: //,
        contractAddress: //,
        functionName: //,
        params: {},
        msgValue:
    })

    return <div>Hi from Equity Loans</div>
}
