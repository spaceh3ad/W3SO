import { ethers } from "hardhat";
import { SecurityOracle__factory } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  const oracle = await new SecurityOracle__factory(deployer).deploy();

  console.log(`Oracle deployed to ${oracle.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
