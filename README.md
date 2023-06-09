## MojaKwaMoja

_Moja kwa Moja is swahili meaning directly_.

The moja kwa moja protocol enables transfer of donations directly to beneficiaries. Using chainlink we are able to create voice identity wallets for the beneficiaries. Protocol uses the beneficiary's confirmed voice to release donated funds to vendors.

1. Charities are responsible for onboarding vendors who wish to distribute goods & services.
2. Charities then onboard beneficiaries voice print to the diferent goods/services available.
3. Goods/Services are listed on main page to allow donors to choose what they wish to donate to.
4. Donations are then distributed to beneficiaries per goods/services
5. Beneficary visits vendors location to redeem goods/services.
6. Once their voice is AI verified against the onboarding voice print the funds are transfered to the vendor.

Moja kwa Moja attempts to solve 2 problems

- Beneficiary authenticity.
  Do beneficiary exists and are funds used for the primary reason beneficiary
  was onboarded?

- Proof of funds transfer to beneficiaries.
  Records utilization of funds directly by beneficiary.
  We get an added advantage of removing middlemen in the flow of funds increasing funds available for beneficiaries.

The motivation behind this is growing distrust among people on the use of donation funds as well as institutional donors requiring charity organizations to do constant audits before subsequent donations. 

Moja kwa Moja demonstrates how transfers can be approved by beneficiaries with no digital devices at a vendors store. All this is tracked on a public blockchain ledger which 
can be easily audited. Donors are able to trust fund utilization as everything is governed
by the smart contract. Benefeciaries are able to keep there privacy, protocol only
stores a voucher representation while their personal information remains offchain.


### Roadmap
- Increase secruity of api endpoints used through authorization tokens
- Increase security of voice print by using auditable voice words that can be transcribed from redeeming voice
- Allow cross use of single voice identity across charity organizations
- Train voice AI model with onboarded voice identities and use voice labelling during verification
- Improve smart contract to randomize distribution of funds to beneficiaries
- Automate distribution of funds through chainlink upkeep
- A notification for vendors that funds have been transfered allowing release of goods/services
