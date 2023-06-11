'use client';
import { Web3Button } from '@web3modal/react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useBalance } from 'wagmi';
import { Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

export default function Nav() {
  const [showMessage, setShowMessage] = useState(false);
  const [charityBalance, setCharityBalance] = useState('');

  const { isConnected } = useAccount();

  const { data } = useBalance({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    watch: true
  });

  useEffect(() => {
    if (data && data.value) {
      const val = formatUnits(data.value, 15);
      const valA = val.split('.');
      setCharityBalance(valA[0]);
    }
  }, [data]);

  useEffect(() => {
    setShowMessage(isConnected);
  }, [isConnected]);

  return (
    <nav className="border-gray-200 bg-white px-2 py-2.5 dark:bg-gray-800 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <a href="/" className="flex items-center">
          <Image src="/logo.png" className="mr-3" alt="Logo" width={100} height={150} />
          <span className="mx-5 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Moja Kwa Moja
          </span>
        </a>
        <div className="flex md:order-2">
          <ul className="mt-4 mx-2 flex flex-col items-center justify-between md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
            {charityBalance != '' && (
              <li className="text-gray-700 dark:text-white">
                <span className="text-xs">DONATIONS </span>
                <span className="font-bold">{charityBalance} </span>
                <span className="text-xs">MATIC</span>
              </li>
            )}
            <li>
              <Link
                href="/charities"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Charities
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Donate
              </Link>
            </li>
            <li>
              <Link
                href="/redeem"
                className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Redeem
              </Link>
            </li>
          </ul>

          <Web3Button />
        </div>
      </div>

      {!showMessage && (
        <div className="container mx-auto my-2">
          <Alert color="failure">
            <p>
              <span className="font-medium mr-2">Info alert! </span>
              Please connect wallet to interact with app
            </p>
          </Alert>
        </div>
      )}
    </nav>
  );
}
