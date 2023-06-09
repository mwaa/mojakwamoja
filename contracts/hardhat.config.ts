import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COMPILER_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1000000
  },
  metadata: {
    bytecodeHash: 'none'
  }
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: COMPILER_SETTINGS
      },
      {
        version: '0.6.6',
        settings: COMPILER_SETTINGS
      },
      {
        version: '0.4.24',
        settings: COMPILER_SETTINGS
      }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: POLYGON_MUMBAI_RPC_URL,
        blockNumber: 36405847,
        enabled: true
      },
      chainId: 31337
    },
    localhost: {
      chainId: 31337
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001
    }
  },
  defaultNetwork: 'hardhat'
};

export default config;
