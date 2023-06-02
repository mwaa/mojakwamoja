import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import ORACLE_ABI from '@chainlink/contracts/abi/v0.8/OracleInterface.json';


const networkConfig = {
  name: 'localhost',
  fee: '100000000000000000',
  jobId: ethers.utils.toUtf8Bytes('29fa9aa13bf1468788b7cc4a500a45b8'),
  fundAmount: '10000000000000000000'
};

describe('Donations', function () {
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDonationsFixture() {
    const [deployer] = await ethers.getSigners();

    const linkTokenFactory = await ethers.getContractFactory('LinkToken');
    const linkToken = await linkTokenFactory.connect(deployer).deploy();

    const mockOracleFactory = await ethers.getContractFactory('MockOracle');
    const mockOracle = await mockOracleFactory.connect(deployer).deploy(linkToken.address);

    const donationsFactory = await ethers.getContractFactory('Donations');
    const donations = await donationsFactory
      .connect(deployer)
      .deploy(mockOracle.address, networkConfig.jobId, networkConfig.fee, linkToken.address);

    await linkToken.connect(deployer).transfer(donations.address, networkConfig.fundAmount);

    return { donations, mockOracle };
  }

  describe('External requests', function () {
    it('Should successfully make an API request', async function () {
      const { donations } = await loadFixture(deployDonationsFixture);
      const transaction = await donations.requestRedeem('trackerID', 'voucherID', 'productID', 'first', 'second');
      const transactionReceipt = await transaction.wait(1);
      const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : 0;
      expect(requestId).to.not.be.null;
    });

    // it('Should successfully make an API request and get a result', async function () {
    //   const { donations, mockOracle } = await loadFixture(deployDonationsFixture);
    //   const transaction = await donations.requestRedeem('trackerID', 'voucherID', 'productID', 'first', 'second');
    //   const transactionReceipt = await transaction.wait(1);
    //   const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : '0';

    //   await mockOracle.fulfillOracleRequest(requestId, ethers.utils.formatBytes32String('trackingID'));

    //   const totalDonations = await donations.totalDonations();
    //   expect(totalDonations).to.equal(400);
    // });
  });
});
