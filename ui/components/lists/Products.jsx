'use client';
import React, { useEffect, useState } from 'react';
import ProductForm from '../forms/ProductForm';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from 'flowbite-react';

export default function Products({ charity }) {
  const [showForm, setShowForm] = useState(false);
  const [productsElement, setProductsElement] = useState();

  useEffect(() => {
    const products = Object.values(charity.PRODUCTS);
    const htmlLoop = products.map((product) => (
      <Link
        key={product._id}
        href={`/charities/${charity._id}/product/${product._id}/beneficiaries`}
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <Image
          src={product.image}
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg dark:bg-white"
          alt="logo"
          width={200}
          height={100}
        />

        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.cost}</p>
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            Beneficiaries
          </span>
        </div>
      </Link>
    ));
    setProductsElement(htmlLoop);
  }, [charity]);

  return (
    <div className="flex">
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
          Add a new product
        </button>
      </div>

      <Modal popup={true} show={showForm} onClose={() => setShowForm(false)}>
        <Modal.Header />
        <Modal.Body>
          <ProductForm charityID={charity._id} closeOnSave={() => setShowForm(false)} />
        </Modal.Body>
      </Modal>

      <div className="container flex">
        <div className="grid grid-cols-3 gap-5">{productsElement}</div>
      </div>
    </div>
  );
}
