import { ethers } from "hardhat";
import { SecurityOracle__factory } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  const oracle = new SecurityOracle__factory(deployer).attach(
    "0x4f8ac9aa3C2Af1f44f7Dee0124819B06E7410f25"
  );

  await oracle.securityScan("0x872f19a670e5f35eb0eae20ecf9167a5860184d2", {
    gasLimit: 200_000,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
