'use client';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import DONATIONS_ABI from '@/abis/donations.json';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import useDebounce from '@/utils/useDebounce';
import { Alert } from 'flowbite-react';
import { useWeb3Modal } from '@web3modal/react';
import { parseUnits } from 'viem';

export default function ProductForm({ isVisible, charityID, closeOnSave }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const defaultForm = useMemo(
    () => ({
      _id: uuid(),
      name: '',
      image: '',
      display: '',
      product: '',
      payout: address,
      isBundle: false,
      cost: 0
    }),
    [address]
  );

  const [showError, setShowError] = useState(isConnected ? false : true);
  const [form, setForm] = useState(defaultForm);

  const debouncedForm = useDebounce(form, 1000);
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'addCharityProduct',
    args: [debouncedForm._id, parseUnits(debouncedForm.cost.toString(), 15), debouncedForm.payout],
    enabled: debouncedForm._id != '' && debouncedForm.payout != '' && debouncedForm.cost > 0
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const buildFormData = () => {
    const body = new FormData();
    body.append('_id', form._id);
    body.append('name', form.name);
    body.append('image', form.image);
    body.append('product', form.product);
    body.append('payout', form.payout);
    body.append('isBundle', form.isBundle);
    body.append('cost', form.cost);
    body.append('charityID', charityID);
    body.append('entity', 'PRODUCTS');

    return body;
  };

  const saveProduct = () => {
    if (isConnected) {
      fetch(`/api/charities/${charityID}`, {
        method: 'POST',
        body: buildFormData()
      })
        .then((response) => response.json())
        .then((response) => {
          write();
          setForm(defaultForm);
          closeOnSave();
        })
        .catch((e) => {
          console.log('Error unknown: ', e);
        });
    } else {
      setShowError(true);
      open();
    }
  };

  const uploadFile = (image) => {
    setForm({ ...form, image, display: URL.createObjectURL(image) });
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    if (isSuccess) {
      const body = new FormData();
      body.append('name', form.name);
      body.append('image', form.image);
      body.append('product', form.product);
      body.append('payout', form.payout);
      body.append('isBundle', form.isBundle);
      body.append('cost', parseUnits(form.cost.toString(), 15));
      body.append('charityID', charityID);
      body.append('entity', 'PRODUCTS');
    }
  }, [isSuccess]);

  useEffect(() => {
    setForm(defaultForm);
  }, [isVisible, defaultForm]);

  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-5 dark:border-gray-700 w-full">
      <h2 className="my-2 text-sm text-gray-900 dark:text-gray-300">Fill in product details</h2>

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

      <div className="pt-5 grid gap-6 mb-6 lg:grid-cols-2">
        <div id="leftColumn">
          <div className="relative mb-2">
            <input
              type="text"
              id="name"
              name="name"
              className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
              required
              value={form.name}
              onChange={handleChange}
            />
            <label
              htmlFor="name"
              className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Provider Company Name
            </label>
          </div>

          <div className="relative mb-2">
            <input
              type="text"
              id="payout"
              name="payout"
              className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
              required
              disabled
              value={form.payout}
            />
            <label
              htmlFor="payout"
              className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Payout Address
            </label>
          </div>
        </div>

        <div id="rightColumn">
          <div className="relative mb-2">
            <input
              type="text"
              id="product"
              name="product"
              className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
              required
              value={form.product}
              onChange={handleChange}
            />
            <label
              htmlFor="product"
              className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Product Selling Name
            </label>
          </div>

          <div className="relative mb-2">
            <input
              type="number"
              id="cost"
              name="cost"
              className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
              required
              value={form.cost}
              onChange={handleChange}
            />
            <label
              htmlFor="cost"
              className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Product Unit Cost
            </label>
          </div>

          <div className="relative mb-2">
            <label
              htmlFor="large-toggle"
              className="inline-flex relative items-center cursor-pointer"
            >
              <input type="checkbox" value="" id="large-toggle" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Bundled products?
              </span>
            </label>
          </div>
        </div>
      </div>

      {form.image != '' ? (
        <div className="relative mb-2">
          <Image src={form.display} className="rounded-lg" alt="logo" width={500} height={256} />
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center w-full mb-2">
            <label
              htmlFor="productImage"
              className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <svg
                  className="mb-3 w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                name="image"
                id="productImage"
                type="file"
                className="hidden"
                onChange={(e) => uploadFile(e.target.files[0])}
              />
            </label>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => closeOnSave()}
        disabled={isLoading}
        className="float-right mx-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => saveProduct()}
        className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        {isLoading && (
          <span role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </span>
        )}
        {!isLoading && <span>Save Product</span>}
      </button>
    </form>
  );
}
