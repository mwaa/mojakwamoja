import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const networkConfig = {
  name: "localhost",
  fee: "100000000000000000",
  jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
  fundAmount: "1000000000000000000",
};

const stripHexPrefix = (hex: any) => {
  if (!ethers.utils.isHexString(hex)) {
    throw Error(`Expected valid hex string, got: "${hex}"`);
  }

  return hex.replace("0x", "");
};

const addHexPrefix = (hex: any) => {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
};

const numToBytes32 = (num: number) => {
  const hexNum = ethers.utils.hexlify(num);
  const strippedNum = stripHexPrefix(hexNum);
  if (strippedNum.length > 32 * 2) {
    throw Error(
      "Cannot convert number to bytes32 format, value is greater than maximum bytes32 value"
    );
  }
  return addHexPrefix(strippedNum.padStart(32 * 2, "0"));
};

describe("Donations", function () {
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDonationsFixture() {
    const [deployer] = await ethers.getSigners();

    const linkTokenFactory = await ethers.getContractFactory("LinkToken");
    const linkToken = await linkTokenFactory.connect(deployer).deploy();

    const mockOracleFactory = await ethers.getContractFactory("MockOracle");
    const mockOracle = await mockOracleFactory.connect(deployer).deploy(linkToken.address);

    const jobId = ethers.utils.toUtf8Bytes(networkConfig["jobId"]);
    const fee = networkConfig["fee"];

    const donationsFactory = await ethers.getContractFactory("Donations");
    const donations = await donationsFactory
      .connect(deployer)
      .deploy(mockOracle.address, jobId, fee, linkToken.address);

    await linkToken.connect(deployer).transfer(donations.address, networkConfig["fundAmount"]);

    return { donations, mockOracle };
  }

  describe("External requests", function () {
    it("Should successfully make an API request", async function () {
      const { donations } = await loadFixture(deployDonationsFixture);
      const transaction = await donations.requestVolumeData();
      const transactionReceipt = await transaction.wait(1);
      const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : 0;
      expect(requestId).to.not.be.null;
    });

    it("Should successfully make an API request and get a result", async function () {
      const { donations, mockOracle } = await loadFixture(deployDonationsFixture);
      const transaction = await donations.requestVolumeData();
      const transactionReceipt = await transaction.wait(1);
      const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : "0";
      const callbackValue = 777;
      await mockOracle.fulfillOracleRequest(requestId, numToBytes32(callbackValue));
      const volume = await donations.volume();
      expect(volume.toString()).to.equal(callbackValue.toString());
    });

    it("Our event should successfully fire event on callback", async function () {
      const { donations, mockOracle } = await loadFixture(deployDonationsFixture);
      const callbackValue = 777;
      // we setup a promise so we can wait for our callback from the `once` function
      await new Promise(async (resolve, reject) => {
        // setup listener for our event
        donations.once("DataFullfilled", async () => {
          console.log("DataFullfilled event fired!");
          const volume = await donations.volume();
          expect(volume.toString()).to.equal(callbackValue.toString());
          resolve('');
        });
        const transaction = await donations.requestVolumeData();
        const transactionReceipt = await transaction.wait(1);
        const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : "0";
        await mockOracle.fulfillOracleRequest(requestId, numToBytes32(callbackValue));
      });
    });
  });
});
