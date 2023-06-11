import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

// import ORACLE_ABI from '@chainlink/contracts/abi/v0.8/OracleInterface.json';

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
      const transaction = await donations.requestRedeem(
        'trackerID',
        'voucherID',
        'productID',
        'first',
        'second'
      );
      const transactionReceipt = await transaction.wait(1);
      const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : 0;
      expect(requestId).to.not.be.null;
    });

    it('Should successfully make an API request and get a result', async function () {
      const { donations, mockOracle } = await loadFixture(deployDonationsFixture);
      const transaction = await donations.requestRedeem(
        'trackerID',
        'voucherID',
        'productID',
        'first',
        'second'
      );
      const transactionReceipt = await transaction.wait(1);

      const requestId = transactionReceipt.events ? transactionReceipt.events[0].topics[1] : '0';

      // const filter = mockOracle.filters.OracleRequest();
      // const events = await mockOracle.queryFilter(filter);

      // console.log('\n', events, '\n');
      // const {requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration} = events[0].args

      // let encoder = ethers.utils.defaultAbiCoder;
      // let encodedRequest = encoder.encode(['bytes32', 'string', 'bool'], [requestId, 'trackerID', true])

      // let abiCoder = new ethers.utils.Interface(ORACLE_ABI);
      // let options = abiCoder.encodeFunctionData("fulfillOracleRequest", [ requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration,  encodedRequest]);

      await mockOracle.fulfillOracleRequest(requestId, 'trackingId', true);

      const totalDonations = await donations.totalDonations();
      expect(totalDonations).to.equal(0);
    });
  });

  describe('Functionality', function () {
    it("Should return the new greeting once it's changed", async () => {
      const { donations, mockOracle } = await loadFixture(deployDonationsFixture);

      const [_, vendor, beneficiary1, beneficiary2] = await ethers.getSigners();

      const productID = 'MaizeID';

      const addProductTx = await donations.addCharityProduct(
        productID,
        ethers.utils.parseUnits('12', 15),
        vendor.address
      );
      await addProductTx.wait();

      const addBeneficiaryTx = await donations.addBeneficiary(productID, beneficiary1.address);
      await addBeneficiaryTx.wait();

      const addBeneficiary2Tx = await donations.addBeneficiary(productID, beneficiary2.address);
      await addBeneficiary2Tx.wait();

      const donate1Tx = await donations.donate(beneficiary1.address, {
        value: ethers.utils.parseUnits('24', 15)
      });
      await donate1Tx.wait();

      const donate2Tx = await donations.donate(beneficiary2.address, {
        value: ethers.utils.parseUnits('24', 15)
      });
      await donate2Tx.wait();

      const charityDonationTx = await donations.donateToVendor(productID, {
        value: ethers.utils.parseUnits('48', 15)
      });
      await charityDonationTx.wait();

      let balance = await ethers.provider.getBalance(donations.address);
      expect(balance.toString()).to.equal(ethers.utils.parseUnits('96', 15).toString());

      const distributeTx = await donations.distributeVendorDonations(productID);
      await distributeTx.wait();

      const vendorBalanceBefore = await ethers.provider.getBalance(vendor.address);

      console.log(vendorBalanceBefore);

      const requestRedeemTx = await donations.requestRedeem(
        'trackingID',
        beneficiary1.address,
        productID,
        'first',
        'second'
      );
      const txReceipt = await requestRedeemTx.wait(1);
      const requestId = txReceipt.events ? txReceipt.events[0].topics[1] : '0';

      await mockOracle.fulfillOracleRequest(requestId, 'trackingID', true);

      const totalDonations = await donations.totalDonations();
      expect(totalDonations).to.equal(ethers.utils.parseUnits('72', 15).toString());

      const beneficiaryBalance = await donations.getBeneficiaryBalance(beneficiary1.address);
      expect(beneficiaryBalance).to.equal(ethers.utils.parseUnits('36', 15));

      const vendorBalanceAfter = await ethers.provider.getBalance(vendor.address);
      expect(vendorBalanceAfter > vendorBalanceBefore).to.equal(true);

      console.log(vendorBalanceAfter);
      console.log('after this');
      const afterTranserDonations = await donations.totalDonations();
      console.log(afterTranserDonations);
      expect(afterTranserDonations).to.equal(ethers.utils.parseUnits('72', 15).toString());

      const vendorBalance = await donations.getVendorBalance(productID);
      expect(vendorBalance).to.equal(ethers.utils.parseUnits('24', 15));
    });
  });
});
