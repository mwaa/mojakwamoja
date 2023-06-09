'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { v4 as uuid } from 'uuid';
import Audio from './Audio';
import randomWords from '@/utils/randomWords';
import DONATIONS_ABI from '@/abis/donations.json';

export default function RedeemForm({ products }) {
  const { address } = useAccount();
  const [files, setFiles] = useState({
    trackingID: '',
    voucher: '',
    product: '',
    original: '',
    redeem: ''
  });
  const [storeProducts, setStoreProducts] = useState([]);
  const [storeBeneficiaries, setStoreBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    voicePrint: randomWords(10),
    voucher: '',
    product: '',
    audio: null
  });

  const { isSuccess, config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'requestRedeem',
    args: [
      files.trackingID,
      files.voucher,
      files.product,
      `${files.original}.webm`,
      `${files.redeem}.webm`
    ],
    enabled: files.trackingID != ''
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    if (files.trackingID && isSuccess) {
      write();
    }
  }, [files.trackingID, isSuccess, write]);

  useEffect(() => {
    if (address != '') {
      setStoreProducts(products.filter((product) => product.payout === address));
    }
  }, [products, address]);

  useEffect(() => {
    if (form.product != null) {
      const product = storeProducts.filter((product) => product._id === form.product);
      setStoreBeneficiaries(Object.values(product[0]?.BENEFICIARIES || []));
    }
  }, [form.product, storeProducts]);

  const approveTransaction = () => {
    if (form.audio == null) {
      setShowError(true);
    } else {
      const body = new FormData();
      body.append('voucher', form.voucher);
      body.append('voicePrint', form.voicePrint);
      body.append('audio', form.audio);
      body.append('entity', 'BENEFICIARIES');

      fetch(`/api/products/${form.product}/redeem`, {
        method: 'POST',
        body
      })
        .then((response) => response.json())
        .then((response) => {
          response.data['voucher'] = form.voucher;
          response.data['product'] = form.product;
          response.data['trackingID'] = uuid();
          console.log('\nwe got files', response.data, '\n');
          setFiles(response.data);
        })
        .catch((e) => {
          console.log('Error unknown: ', e);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };

  const saveAudio = (audioBlob) => {
    setForm({ ...form, audio: audioBlob });
  };

  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:w-1/3">
      <div className="mb-6">
        <p className="my-2 text-2xl text-gray-900 dark:text-gray-300">Beneficiary Approval</p>

        <div className="relative mb-4 my-2">
          <label
            htmlFor="product"
            className="absolute top-2.5 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Product
          </label>
          <select
            id="product"
            className="block rounded-lg py-2.5 px-2.5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            name="product"
            value={form.product}
            onChange={handleChange}
          >
            <option value="">Choose product</option>
            {storeProducts &&
              storeProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.product}
                </option>
              ))}
          </select>
        </div>

        <div className="relative mb-4 my-2">
          <label
            htmlFor="voucher"
            className="absolute top-2.5 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Voucher Identifier
          </label>
          <select
            id="voucher"
            className="block rounded-lg py-2.5 px-2.5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            name="voucher"
            value={form.voucher}
            onChange={handleChange}
          >
            <option value="">Choose beneficiary voucher</option>
            {storeBeneficiaries &&
              storeBeneficiaries.map((beneficiary) => (
                <option key={beneficiary._id} value={beneficiary._id}>
                  {beneficiary.voucher}
                </option>
              ))}
          </select>
        </div>

        <div className="relative mb-4">
          <textarea
            rows={3}
            type="text"
            id="voicePrint"
            name="voicePrint"
            className="peer my-2 py-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            required
            disabled
            value={form.voicePrint}
          />
          <label
            htmlFor="voicePrint"
            className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Voice Print Read
          </label>
        </div>

        <Audio saveAudio={saveAudio} />
      </div>

      <button
        type="button"
        onClick={() => approveTransaction()}
        className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Approve Transaction
      </button>
    </form>
  );
}
