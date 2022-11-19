const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
import { SecurityOracle__factory, SecurityOracle } from "../typechain-types";
const SECURITY_ORACLE = "0x4f8ac9aa3C2Af1f44f7Dee0124819B06E7410f25";

describe("Requesting data from EA", function () {
  let oracle: SecurityOracle;
  let user;
  let targetAddress = "0xcB3D5008e03Bf569dcdf17259Fa30726ED646931";

  before(async () => {
    [user] = await ethers.getSigners();

    oracle = new SecurityOracle__factory(user).attach(SECURITY_ORACLE);
  });

  describe("oracle:", async () => {
    it("Should allow to request scan smart contract address", async () => {
      await oracle.securityScan(targetAddress, { gasLimit: 200_000 });
      while (true) {
        if (oracle.emit("RequestForInfoFulfilled")) {
          break;
        }
      }
    });
  });
});
