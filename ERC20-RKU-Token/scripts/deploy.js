const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
  const[signer] = await ethers.getSigners()

  const RkuToken = await ethers.getContractFactory("RkuToken");
  const rkuToken = await RkuToken.deploy("RkuToken", "RKU", 5, 100000);
  await rkuToken.deployed();

  console.log(rkuToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
