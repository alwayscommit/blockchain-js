import {ethers} from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

// we use async functions to deploy the contracts and await keywords to actually wait for the methods to be deployed
// if we don't use async functions, the code will run sequentially and try to perform operations using the
// contract that hasn't been deployed yet.

async function main() {
  //compile
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // A more secure approach to not store the private key in the .env file, nor the password, provide it at runtime
  // const encryptedJSON = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJSON,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy(); 
  const deploymentReceipt = await contract.deployTransaction.wait(1);
  console.log(`Contract Address: ${contract.address}`);

  const currentFavNum = await contract.retrieve();
  console.log(currentFavNum); 
  console.log(`Current Favorite Number: ${currentFavNum.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);

  const updatedFavNum = await contract.retrieve();
  console.log(`Updated Favorite Number: ${updatedFavNum.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
