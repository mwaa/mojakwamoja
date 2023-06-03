'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

export default function CharityForm({ onClose }) {
  const router = useRouter();

  const uploadEl = useRef(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: '',
    image: ''
  });

  const uploadFile = (image) => {
    setForm({ ...form, image, logo: URL.createObjectURL(image) });
  };

  const saveCharity = () => {
    const body = new FormData();
    body.append('image', form.image);
    body.append('name', form.name);
    body.append('description', form.description);

    fetch('/api/charities/add', {
      method: 'POST',
      body
    })
      .then((response) => response.json())
      .then((record) => {
        router.push(`/charities/${record.data._id}`);
      })
      .catch((e) => {
        console.log('Error unknown: ', e);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };

  return (
    <form className="mx-auto my-4 rounded-lg border-2 border-gray-200 p-5 dark:border-gray-700 md:w-full">
      <h2 className="my-4 font-light text-2xl text-gray-900 dark:text-gray-300">
        Fill in the Charity details
      </h2>

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div aria-label="start">
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
              Organization Name
            </label>
          </div>

          <div className="relative mb-2">
            <textarea
              id="description"
              name="description"
              className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
              required
              rows={7}
              value={form.description}
              onChange={handleChange}
            />
            <label
              htmlFor="description"
              className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Description
            </label>
          </div>
        </div>

        <div aria-label="end">
          {form.logo != '' ? (
            <div className="relative mb-2">
              <Image
                src={form.logo}
                className="rounded-lg"
                alt="logo"
                width={256}
                height={256}
                onClick={() => {
                  if (uploadEl && uploadEl.current) {
                    uploadEl.current.click();
                  }
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center w-full mb-2">
                <label
                  htmlFor="organizationLogo"
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
                    name="logo"
                    id="organizationLogo"
                    type="file"
                    className="hidden"
                    ref={uploadEl}
                    onChange={(e) => uploadFile(e.target.files[0])}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onClose()}
        className="mx-2 float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => saveCharity()}
        className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Save Charity
      </button>
    </form>
  );
}
