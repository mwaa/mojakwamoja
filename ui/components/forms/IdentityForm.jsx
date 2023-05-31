import React, { FormEvent, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Audio from './Audio';
import { Alert } from 'flowbite-react';
import randomWords from '@/utils/randomWords';

export default function IdentityForm({ charityID, productID, closeOnSave }) {
  const [form, setForm] = useState({
    voucher: uuid(),
    voicePrint: randomWords(10),
    audio: null
  });
  const [showError, setShowError] = useState(false);

  const createAccount = () => {
    if (form.audio == null) {
      setShowError(true);
    } else {
      const body = new FormData();
      body.append('voucher', form.voucher);
      body.append('voicePrint', form.voicePrint);
      body.append('audio', form.audio);
      body.append('entity', 'BENEFICIARIES');

      fetch(`/api/charities/${charityID}/product/${productID}`, {
        method: 'POST',
        body
      })
        .then((response) => response.json())
        .then((record) => {
          console.log('saved', record);
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

  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-5 dark:border-gray-700 w-full">
      <div className="mb-6 pt-5">
        <p className="my-2 text-sm text-gray-900 dark:text-gray-300">
          Generate beneficiary account
        </p>

        {showError && (
          <Alert color="failure" icon={H} onDismiss={() => setShowError(false)}>
            <span>
              <p>
                <span className="font-medium">Info alert!</span>
                Change a few things up and try submitting again.
              </p>
            </span>
          </Alert>
        )}
        <div className="relative mb-2">
          <input
            type="text"
            id="voucher"
            name="voucher"
            className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            required
            disabled
            value={form.voucher}
          />
          <label
            htmlFor="voucher"
            className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Voucher Label
          </label>
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
        Save Beneficiary
      </button>
    </form>
  );
}
