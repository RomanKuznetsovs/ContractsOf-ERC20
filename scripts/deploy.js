const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
    const[signer] = await ethers.getSigners()

    const ERC20 = await hre.ethers.getContractFactory("RShop", signer);
    const erc = await ERC20.deploy()
  
    await erc.deployed()
  
    console.log(erc.address)
    console.log(await erc.token())
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });