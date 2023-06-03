import React from 'react';
import Link from 'next/link';
import AddProductButton from '../forms/AddProductButton';
import Image from 'next/image';

export default function Products({ charity, refreshData }) {
  const products = Object.values(charity.PRODUCTS || []);
  const productHtmlElements = products.map((product) => (
    <Link
      key={product._id}
      href={`/charities/${charity._id}/product/${product._id}/beneficiaries`}
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <Image
          src={product.image}
          className="object-cover w-full rounded-t-lg h-full md:w-48 md:rounded-none md:rounded-l-lg"
          alt="Product"
          width={200}
          height={200}
        />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {product.product}
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          <p className="mb-3">${product.cost}</p>
          <p className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {Object.values(product.BENEFICIARIES || []).length} Beneficiaries
          </p>
        </div>
      </div>
    </Link>
  ));

  return (
    <>
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {charity.name}
        </span>
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        {charity.description}
      </p>

      <div className="flex mt-2">
        <AddProductButton charityID={charity._id} refreshData={refreshData} />
        <div className="container flex">
          <div className="grid grid-cols-3 gap-5">{productHtmlElements}</div>
        </div>
      </div>
    </>
  );
}
