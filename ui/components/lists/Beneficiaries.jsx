'use client';
import React, { useEffect, useState } from 'react';
import IdentityForm from '../forms/IdentityForm';
import { Modal } from 'flowbite-react';

export function Beneficiaries({ charityID, product }) {
  const [showForm, setShowForm] = useState(false);
  const [beneficiariesElement, setBeneficiariesElement] = useState();

  useEffect(() => {
    if (product && product.BENEFICIARIES) {
      const beneficiaries = Object.values(product.BENEFICIARIES);
      const htmlLoop = beneficiaries.map((beneficiary) => (
        <div
          key={beneficiary._id}
          className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {beneficiary.voucher}
            </h5>
          </div>
        </div>
      ));
      setBeneficiariesElement(htmlLoop);
    }
  }, [product]);

  return (
    <div className="flex dark:text-white">
      <div className="flex-none">
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
      </div>

      <Modal popup={true} show={showForm} onClose={() => setShowForm(false)}>
        <Modal.Header />
        <Modal.Body>
          <IdentityForm
            charityID={charityID}
            productID={product._id}
            closeOnSave={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      <div className="container">
        <h1>{product.name}</h1>
        <div className="grid grid-cols-3 gap-5">{beneficiariesElement}</div>
      </div>
    </div>
  );
}
