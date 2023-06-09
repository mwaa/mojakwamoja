'use client';
import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi';
import { v4 as uuid } from 'uuid';
import { formatUnits, parseUnits } from 'viem';
import { Alert, Modal } from 'flowbite-react';
import Audio from './Audio';
import randomWords from '@/utils/randomWords';
import DONATIONS_ABI from '@/abis/donations.json';

export default function RedeemForm({ products }) {
  const { address } = useAccount();

  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const donationsContract = {
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI
  };

  const { isSuccess, config } = usePrepareContractWrite({
    ...donationsContract,
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
  const { isLoading: approveLoading, isSuccess: approveSuccess, write } = useContractWrite(config);

  const {
    data: balanceData,
    isLoading: readLoading,
    refetch
  } = useContractRead({
    ...donationsContract,
    functionName: 'getBeneficiaryBalance',
    args: [form.voucher],
    enabled: form.voucher != ''
  });

  useContractEvent({
    ...donationsContract,
    eventName: 'RedeemSuccess',
    listener(log) {
      console.log('Event log', log[0]);
      refetch();
      if (address == log[0].args.vendor) {
        setMessage(
          `${formatUnits(log[0].args.amount, 15)} MATIC has been transferred successfully`
        );
        setOpenModal(true);
      }
    }
  });

  useContractEvent({
    ...donationsContract,
    eventName: 'RedeemFail',
    listener(log) {
      console.log('Event log', log[0]);
      if (address == log[0].args.vendor) {
        setMessage(log[0].args.message);
        setOpenModal(true);
      }
    }
  });

  useEffect(() => {
    if (files.trackingID && isSuccess) {
      write();
      setIsSubmitted(true);
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
          console.log('\n we got files', response.data, '\n');
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

        {form.voucher && (
          <div className="mb-6">
            <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 font-normal tracking-tight text-gray-900 dark:text-white">
                Beneficiary Balance
              </h5>
              <p className="font-bold text-2xl text-gray-700 dark:text-gray-400">
                {!readLoading && <span>{formatUnits(balanceData, 15)} MATIC</span>}
                {readLoading && (
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
              </p>
              <p className="text-xs italic text-gray-900 dark:text-white">
                PS. Values displayed to 15 points instead of normal 18
              </p>
            </div>
          </div>
        )}

        {isSubmitted && message == '' && (
          <div className="flex justify-center items-center">
            <span role="status">
              <svg
                aria-hidden="true"
                className="w-36 h-36 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              <span className="text-gray-900 dark:text-white">Approving...</span>
            </span>
          </div>
        )}

        {!isSubmitted && (
          <>
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

            {showError && (
              <Alert className="mb-4" color="failure" onDismiss={() => setShowError(false)}>
                <span>
                  <p>
                    <span className="font-medium">Info alert! </span>
                    Please record voice before you approve transaction
                  </p>
                </span>
              </Alert>
            )}

            <Audio saveAudio={saveAudio} />

            <button
              type="button"
              onClick={() => approveTransaction()}
              className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Approve Transaction
            </button>
          </>
        )}

        {isSubmitted && (
          <button
            type="button"
            onClick={() => location.reload()}
            className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            New Redeem
          </button>
        )}
      </div>

      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => {
          refetch();
          setOpenModal(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Redeem Status
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  refetch();
                  setOpenModal(false);
                }}
                className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Exit
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </form>
  );
}
