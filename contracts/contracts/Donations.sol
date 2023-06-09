//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

/**
 * @title The Donations contract
 * @notice Holds donations and transfers to vendors on succesful redeem
 */
contract Donations is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    address private immutable oracle;
    bytes32 private immutable jobId;
    uint256 private immutable fee;

    uint256 public totalDonations;

    mapping(string => uint256) public beneficiaryDonations;
    mapping(string => uint256) public productDonations;
    mapping(string => string[]) private productBeneficiary;
    mapping(string => uint256) public productRegistry;
    mapping(string => address payable) public payoutRegistry;

    struct RedeemRequest {
        string voucher;
        string product;
    }
    mapping(string => RedeemRequest) private redeemRegistry;

    event NewBeneficiary(string voucher, string product);
    event RedeemFullfilled(address _vendor, string _trackID, uint256 _amount);

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     * @param _oracle - address of the specific Chainlink node that a contract makes an API call from
     * @param _jobId - specific job for :_oracle: to run; each job is unique and returns different types of data
     * @param _fee - node operator price per API call / data request
     * @param _link - LINK token address on the corresponding network
     *
     */
    constructor(
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        address _link
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_link);
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function addBeneficiary(
        string memory product,
        string memory voucher
    ) public {
        require(productRegistry[product] != 0, 'Product does not exist');

        productBeneficiary[product].push(voucher);
        emit NewBeneficiary(voucher, product);
    }

    function addCharityProduct(
        string memory product,
        uint256 cost,
        address payable vendorAccount
    ) public {
        require(cost > 0, 'Product cost should be greater than 0');
        productRegistry[product] = cost;
        payoutRegistry[product] = vendorAccount;
    }

    /**
     * Funds donated directly to benefiary
     */
    function donate(string memory voucher) public payable {
        require(msg.value > 0, 'Donation must be greater than 0');

        beneficiaryDonations[voucher] += msg.value;
        totalDonations += msg.value;
    }

    /**
     * Funds donated to product vendor
     */
    function donateToVendor(string memory product) public payable {
        require(msg.value > 0, 'Donation must be greater than 0');

        productDonations[product] += msg.value;
        totalDonations += msg.value;
    }

    /**
     * Distribute vendor funds based on registered beneficiaris of product
     */
    function distributeVendorDonations(string memory product) public {
        uint256 unitCost = productRegistry[product];
        require(productDonations[product] > unitCost, 'Insufficient funds');

        // find how many recipients based on available donated funds
        uint256 recipients = productDonations[product] / unitCost;

        for (uint256 i = 0; i < recipients; i++) {
            // TODO:: award random beneficiaries
            // Explore using space and time to query remaining beneficiaries
            // who haven't been awarded a product
            if (productBeneficiary[product].length > i) {
                string memory beneficiary = productBeneficiary[product][i]; 

                beneficiaryDonations[beneficiary] += unitCost;
                productDonations[product] -= unitCost;
                totalDonations -= unitCost;
            }

            // TODO:: transfer to escrow wallet which only transfers out if request is from donations contract
        }
    }

    /**
     * @notice Creates a Chainlink request to redeem donations fund from beneficiary & transfer to vendor
     * @return requestId - id of the request
     */
    function requestRedeem(
        string memory trackingId,
        string memory voucher,
        string memory product,
        string memory original,
        string memory redeem
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillReedeem.selector
        );

        req.add('trackingId', trackingId);
        req.add('original', original);
        req.add('redeem', redeem);

        RedeemRequest memory newRedeem = RedeemRequest(voucher, product);
        redeemRegistry[trackingId] = newRedeem;

        return sendChainlinkRequestTo(oracle, req, fee);
    }
    /**
     * @notice Receives the response in the form of bool
     *
     * @param requestId - id of the request
     * @param trackingId - id of redeem request
     * @param isMatching - response; if provided audio files match speaker
     */
    function fulfillReedeem(
        bytes32 requestId,
        string memory trackingId,
        bool isMatching
    ) public recordChainlinkFulfillment(requestId) {

        if (isMatching) {
            RedeemRequest memory redeemRecord = redeemRegistry[trackingId];

            uint256 currentBalance = beneficiaryDonations[redeemRecord.voucher];
            uint256 unitCost = productRegistry[redeemRecord.product];
            require(currentBalance > unitCost, 'Insufficient balance');
            address payable vendor = payoutRegistry[redeemRecord.product];

            // Send funds to vendor
            vendor.transfer(unitCost);

            emit RedeemFullfilled(vendor, trackingId, unitCost);
        }
    }

    /**
     * @notice Withdraws LINK from the contract
     * @dev Implement a withdraw function to avoid locking your LINK in the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            'Unable to transfer Link'
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
