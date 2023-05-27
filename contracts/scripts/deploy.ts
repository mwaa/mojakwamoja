import { ethers } from "hardhat";
import LINK_TOKEN_ABI from "@chainlink/contracts/abi/v0.4/LinkToken.json";

const networkConfig = {
  name: "mumbai",
  linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  oracle: process.env.ORACLE_ADDRESS,
  jobId: ethers.utils.toUtf8Bytes(process.env.JOB_ID || ""),
  fee: "100000000000000000",
  fundAmount: "100000000000000000", // 0.1
};

async function main() {
  //set log level to ignore non errors
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const linkTokenAddress = networkConfig.linkToken;
  const donationsFactory = await ethers.getContractFactory("Donations");
  const donations = await donationsFactory.deploy(
    networkConfig.oracle,
    networkConfig.jobId,
    networkConfig.fee,
    linkTokenAddress
  );

  await donations.deployed();

  console.log(`Donations deployed to ${donations.address}`);

  // auto-funding
  const fundAmount = networkConfig.fundAmount;
  const linkToken = new ethers.Contract(linkTokenAddress, LINK_TOKEN_ABI, deployer);
  await linkToken.transfer(donations.address, fundAmount);

  console.log(`Donations funded with ${fundAmount} JUELS`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
