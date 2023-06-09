'use client';
import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import DONATIONS_ABI from '@/abis/donations.json';
import IdentityForm from './IdentityForm';

export default function AddBeneficiaryButton({ charityID, productID, refreshData }) {
  const [showForm, setShowForm] = useState(false);

  const { isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'distributeVendorDonations',
    args: [productID]
  });
  const { isLoading, write } = useContractWrite(config);

  const distributeDonations = () => {
    if (isConnected) {
      write();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-7 py-4 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Add new beneficiary to product
        </button>

        <button
          type="button"
          className="my-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-7 py-4 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => distributeDonations()}
        >
          Distribute Funds
        </button>
      </div>

      <Modal popup={true} show={showForm} onClose={() => setShowForm(false)}>
        <Modal.Header />
        <Modal.Body>
          <IdentityForm
            charityID={charityID}
            productID={productID}
            closeOnSave={() => {
              refreshData();
              setShowForm(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
