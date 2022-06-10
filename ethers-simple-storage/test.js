const ethers = require("ethers");
const fs = require("fs");

async function main() {
  // compile
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://172.23.48.1:7545"
  );
  const wallet = new ethers.Wallet(
    "07ec347b7b6f5d70f96210fe82f1169f97492c05a26174d2ebe2a2faceb03933",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait....");
  const contract = await contractFactory.deploy(); // STOP here! Wait for contract to deploy!
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
