"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function ProductForm({ charityID, closeOnSave }) {
  const [form, setForm] = useState({
    name: "",
    image: "",
    display: "",
    product: "",
    payout: "",
    isBundle: false,
    cost: 0,
  });

  const saveProduct = () => {
    const body = new FormData();
    body.append("name", form.name);
    body.append("image", form.image);
    body.append("product", form.product);
    body.append("payout", form.payout);
    body.append("isBundle", form.isBundle);
    body.append("cost", form.cost);
    body.append("charityID", charityID);
    body.append("entity", "PRODUCTS");

    fetch(`/api/charities/${charityID}`, {
      method: "POST",
      body,
    })
      .then((response) => response.json())
      .then((record) => {
        console.log("saved", record);
        closeOnSave();
      })
      .catch((e) => {
        console.log("Error unknown: ", e);
      });
    console.log("new");
  };

  const uploadFile = (image) => {
    setForm({ ...form, image, display: URL.createObjectURL(image) });
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };

  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-5 dark:border-gray-700 w-full">
      <h2 className="my-2 text-sm text-gray-900 dark:text-gray-300">Fill in Product details</h2>

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
              value={form.payout}
              onChange={handleChange}
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

      {form.image != "" ? (
        <div className="relative mb-2">
          <Image src={form.display} className="rounded-lg" alt="logo" width={100} height={100} />
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
        className="float-right mx-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => saveProduct()}
        className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Save Product
      </button>
    </form>
  );
}
