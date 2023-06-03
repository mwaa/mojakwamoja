'use client';
import { useState } from 'react';
import { Modal } from 'flowbite-react';
import ProductForm from './ProductForm';

export default function AddProductButton({ charityID, refreshData }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex-none">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-3 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
          Add a new product
        </button>
      </div>

      <Modal popup={true} size="4xl" show={showForm} onClose={() => setShowForm(false)}>
        <Modal.Header />
        <Modal.Body>
          <ProductForm
            isVisible={showForm}
            charityID={charityID}
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
