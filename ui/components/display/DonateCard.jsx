'use client';
import { useAccount, useContractWrite } from 'wagmi';
import DONATIONS_ABI from '@/abis/donations.json';
import { parseUnits } from 'viem';
import Jazzicon from 'react-jazzicon';

export default function DonateCard({ product }) {
  const { address, isConnected } = useAccount();
  const { write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'donate'
  });

  const triggerDonation = (voucher, amount) => {
    console.log('This is the voucher we are using', voucher);
    if (isConnected) {
      write({
        args: [voucher],
        from: address,
        value: parseUnits(amount.toString(), 15),
        onSuccess(data) {
          console.log('Success in donation', data);
        }
      });
    }
  };

  const voucherDisplay = (voucher) => {
    const splitArray = voucher.split('-');
    return splitArray[0];
  };

  const beneficiaries = Object.values(product.BENEFICIARIES || []);
  const beneficiariesElement = beneficiaries.map((beneficiary) => (
    <div
      key={beneficiary._id}
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex flex-col items-center p-5">
        <Jazzicon diameter={100} seed={beneficiary.displaySeed} />

        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Voucher: {voucherDisplay(beneficiary.voucher)}
        </h5>

        <div className="mb-2 tracking-tight text-gray-900 dark:text-white">
          <p className="text-lg font-bold flex justify-between">
            <span>Product: {product.product}</span>
          </p>
          <p className="text-xs italic text-gray-900 dark:text-white">
            Unit cost {product.cost} MATIC
          </p>
          <p className="text-xs italic text-gray-900 dark:text-white">provided by {product.name}</p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(beneficiary.voucher, product.cost * 1)}
            >
              x1
            </button>
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(beneficiary.voucher, product.cost * 2)}
            >
              x2
            </button>
            <button
              type="button"
              className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(beneficiary.voucher, product.cost * 3)}
            >
              x3
            </button>
            <button
              type="button"
              className=" text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(beneficiary.voucher, product.cost * 4)}
            >
              x4
            </button>

            <button
              type="button"
              className=" text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
              onClick={() => triggerDonation(beneficiary.voucher, product.cost * 5)}
            >
              x5
            </button>
          </div>
          <p className="text-xs my-1 italic text-gray-900 dark:text-white">
            Click on the number of units to donate
          </p>
        </div>
      </div>
    </div>
  ));

  return beneficiariesElement;
}
