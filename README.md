## MojaKwaMoja

_Moja kwa Moja is swahili meaning directly_.

The moja kwa moja protocol enables transfer of donations directly to beneficiaries. Using chainlink adapter and voice AI model, charities are able to create voice governed wallets for the beneficiaries. The protocol uses the beneficiary's confirmed voice to release donated funds to charity onboarded vendors.

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


## SETUP
----

### Voice_ai

Setup as python flask project

1. Create your own python environment
2. Setup nemo as per README https://github.com/NVIDIA/NeMo
```
apt-get update && apt-get install -y libsndfile1 ffmpeg
pip install Cython
pip install nemo_toolkit['all']
```
3. pip install -r requirements.txt
4. gunicorn --config gunicorn_config.py app:app

### Chainlink Node

1. Use tool like ngrok to create tunnel to localhost:3000
2. Use the ngrok url for the bridge url you create chainlink node
3. In chainlink node add a new job with job spec provided in contracts folder

### Contracts deployment

1. Add you env values such as chainlink job id created above
2. Deploy to network

### UI

Uses next js

1. Add env values such as contract deployed address
2. Install packages
3. Use `npm run dev` to launch the app


