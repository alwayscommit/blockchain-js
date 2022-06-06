const ethers = require("ethers");
const fs = require("fs-extra");

// we use async functions to deploy the contracts and await keywords to actually wait for the methods to be deployed
// if we don't use async functions, the code will run sequentially and try to perform operations using the
// contract that hasn't been deployed yet.

async function main() {
  //compile
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://172.19.240.1:7545"
  );
  const wallet = new ethers.Wallet(
    "60a499fb77cabda4cc2ef388b42baf4cbc2034bfc81fb3cd3110889f267c8ce5",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy(); //wait for contract to deploy
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
