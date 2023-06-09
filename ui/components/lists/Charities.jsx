'use client';
import { Alert, Card, Modal } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import CharityForm from '../forms/CharityForm';

export default function Charities({ charities }) {
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [charitiesElement, setCharitiesElement] = useState();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const onCloseForm = () => {
    setShowForm(false);
  };

  const openForm = () => {
    if (isConnected) {
      setShowForm(true);
    } else {
      setShowError(true);
      open();
    }
  };

  useEffect(() => {
    if (isConnected) {
      setShowError(false);
    }
  }, [isConnected]);

  useEffect(() => {
    const htmlLoop = charities.map((charity) => (
      <Link key={charity._id} href={`/charities/${charity._id}`}>
        <div className="max-w-sm p-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Image
              src={charity.logo || '/donate.png'}
              className="rounded-t-lg"
              alt="logo"
              width={120}
              height={120}
            />
          </div>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {charity.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{charity.description}</p>
        </div>
      </Link>
    ));
    setCharitiesElement(htmlLoop);
  }, [charities]);

  return (
    <>
      {showError && (
        <Alert color="failure" onDismiss={() => setShowError(false)}>
          <span>
            <p>
              <span className="font-medium">Info alert!</span>
              Please connect wallet to proceed
            </p>
          </span>
        </Alert>
      )}
      <div className="flex mt-4">
        <div className="flex-none">
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-7 py-4 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => openForm()}
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
            Add a new charity
          </button>
        </div>

        <Modal popup={true} show={showForm} onClose={onCloseForm}>
          <Modal.Header />
          <Modal.Body>
            <CharityForm onClose={onCloseForm} />
          </Modal.Body>
        </Modal>

        <div className="grid grid-cols-3 gap-6">{charitiesElement}</div>
      </div>
    </>
  );
}
