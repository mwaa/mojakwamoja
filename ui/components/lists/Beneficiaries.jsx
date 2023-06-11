'use client';
import React from 'react';
import AddBeneficiaryButton from '../forms/AddBeneficiaryButton';
import { useAccount, useContractWrite } from 'wagmi';
import DONATIONS_ABI from '@/abis/donations.json';
import { parseUnits } from 'viem';

export function Beneficiaries({ charityID, product, refreshData }) {
  const { address, isConnected } = useAccount();

  const { write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'donate'
  });

  const triggerDonation = (voucher, amount) => {
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

  const beneficiaries = Object.values(product.BENEFICIARIES || []);
  const beneficiariesElement = beneficiaries.map((beneficiary) => (
    <div
      key={beneficiary._id}
      className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-5">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Voucher Identity: {beneficiary.voucher}
        </h5>

        <button
          type="button"
          className="my-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-7 py-4 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => triggerDonation(beneficiary.voucher, product.cost)}
        >
          Donate ${product.cost}
        </button>
      </div>
    </div>
  ));

  return (
    <div className="flex dark:text-white">
      <AddBeneficiaryButton
        charityID={charityID}
        productID={product._id}
        refreshData={refreshData}
      />

      <div className="container">
        <h1 className="text-gray-900 text-2xl dark:text-white">{product.product}</h1>
        <p className="text-xs italic text-gray-900 dark:text-white">provided by {product.name}</p>
        <p className="text-xs italic text-gray-900 dark:text-white mb-4">
          Unit Cost ${product.cost}
        </p>
        <div className="grid grid-cols-3 gap-5">{beneficiariesElement}</div>
      </div>
    </div>
  );
}
