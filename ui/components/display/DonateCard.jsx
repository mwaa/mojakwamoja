'use client';
import Image from 'next/image';
import { useAccount, useContractWrite } from 'wagmi';
import DONATIONS_ABI from '@/abis/donations.json';
import { parseEther, parseGwei, parseUnits } from 'viem';

export default function DonateCard({ product }) {
  const { address, isConnected } = useAccount();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'donateToVendor'
  });

  const triggerDonation = (amount) => {
    if (isConnected) {
      write({
        args: [product._id],
        from: address,
        value: parseUnits(amount.toString(), 15)
      });
    }
  };

  return (
    <div
      key={product._id}
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="w-full h-full md:w-56 rounded-l-lg dark:bg-white p-2">
        <Image
          src={product.image}
          className="object-cover w-full h-96 md:w-48 md:h-auto dark:bg-white"
          alt="Product"
          width={200}
          height={200}
        />
      </div>

      <div className="flex flex-col justify-between p-4 leading-normal">
        <div className="mb-2 tracking-tight text-gray-900 dark:text-white">
          <p className="text-2xl font-bold flex justify-between">
            <span>{product.product}</span>
            <span className="flex justify-center items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 p-2 rounded dark:bg-blue-900 dark:text-blue-300">
              Beneficiaries
              <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-green-800 bg-blue-200 rounded-full">
                {product.BENEFICIARIES ? Object.values(product.BENEFICIARIES).length : 0}
              </span>
            </span>
          </p>
          <p className="text-xs italic">provided by {product.name}</p>
        </div>
        <div className="text-gray-900 dark:text-white">
          <p className="text-3xl font-bold ">${product.cost}</p>
          <p className="text-xs italic">unit cost</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(product.cost * 1)}
            >
              x1
            </button>
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(product.cost * 2)}
            >
              x2
            </button>
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(product.cost * 3)}
            >
              x3
            </button>
            <button
              type="button"
              className=" text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(product.cost * 4)}
            >
              x4
            </button>
          </div>
          <p className="text-xs italic text-gray-900 dark:text-white">
            Click on the number of units to donate
          </p>
        </div>
      </div>
    </div>
  );
}
