'use client';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import Nav from './Nav';

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable');

const chains = [polygonMumbai];
const projectID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
const { publicClient } = configureChains(chains, [w3mProvider({ projectID })]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ projectID, version: 1, chains }),
  publicClient
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const PageLayout = ({ showNav, children }) => {
  return (
    <div className="flex h-screen flex-col dark:bg-gray-800">
      <WagmiConfig config={wagmiConfig}>
        <>
          {showNav && <Nav />}

          <main className="grow bg-white p-8 dark:bg-gray-800">{children}</main>

          <footer className="justify-end bg-white p-4 dark:bg-gray-800">
            <p className="text-center font-light dark:text-white">Copyright 2023 Moja Kwa Moja</p>
          </footer>
        </>
      </WagmiConfig>

      <Web3Modal projectId={projectID} ethereumClient={ethereumClient} />
    </div>
  );
};

export default PageLayout;
