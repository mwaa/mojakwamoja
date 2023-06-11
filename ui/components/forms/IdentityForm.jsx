import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Alert } from 'flowbite-react';
import Audio from './Audio';
import randomWords from '@/utils/randomWords';
import DONATIONS_ABI from '@/abis/donations.json';

export default function IdentityForm({ charityID, closeOnSave, isVisible, productID }) {
  const defaultForm = useMemo(
    () => ({
      voucher: uuid(),
      voicePrint: randomWords(10),
      audio: null
    }),
    [isVisible]
  );

  const [form, setForm] = useState(defaultForm);

  const [showError, setShowError] = useState(false);

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_DONATIONS_ADDRESS,
    abi: DONATIONS_ABI,
    functionName: 'addBeneficiary',
    args: [productID, form.voucher],
    enabled: form.audio != null
  });
  const { isLoading, write } = useContractWrite(config);

  const buildFormData = () => {
    const body = new FormData();
    body.append('voucher', form.voucher);
    body.append('voicePrint', form.voicePrint);
    body.append('audio', form.audio);
    body.append('entity', 'BENEFICIARIES');
    return body;
  };

  const createAccount = () => {
    if (form.audio == null) {
      setShowError(true);
    } else {
      fetch(`/api/charities/${charityID}/product/${productID}`, {
        method: 'POST',
        body: buildFormData()
      })
        .then((response) => response.json())
        .then(() => {
          write();
          closeOnSave();
        })
        .catch((e) => {
          console.log('Error unknown: ', e);
        });
    }
  };

  const saveAudio = (audioBlob) => {
    setForm({ ...form, audio: audioBlob });
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };
  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-5 dark:border-gray-700 w-full">
      <div className="mb-6">
        <p className="my-3 text-sm text-gray-900 dark:text-gray-300">
          Generate beneficiary account
        </p>

        {showError && (
          <Alert color="failure" onDismiss={() => setShowError(false)}>
            <span>
              <p>
                <span className="font-medium">Info alert! </span>
                Please record voice before you save
              </p>
            </span>
          </Alert>
        )}
        <div className="relative my-2">
          <input
            type="text"
            id="voucher"
            name="voucher"
            className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            required
            value={form.voucher}
            onChange={handleChange}
          />
          <label
            htmlFor="voucher"
            className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Voucher Label
          </label>
          <span className="text-xs italic text-gray-900 dark:text-white">
            For the voucher please enter value you can remember during redeem
          </span>
        </div>

        <div className="relative mb-2">
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
        onClick={() => closeOnSave()}
        className="mx-2 float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => createAccount()}
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
        {!isLoading && <span>Save Beneficiary</span>}
      </button>
    </form>
  );
}
