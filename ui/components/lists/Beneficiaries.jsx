import React from 'react';
import AddBeneficiaryButton from '../forms/AddBeneficiaryButton';

export function Beneficiaries({ charityID, product, refreshData }) {
  const beneficiaries = Object.values(product.BENEFICIARIES || []);
  const beneficiariesElement = beneficiaries.map((beneficiary) => (
    <div
      key={beneficiary._id}
      className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {beneficiary.voucher}
        </h5>
      </div>
    </div>
  ));

  return (
    <div className="flex dark:text-white">
      <AddBeneficiaryButton
        charityID={charityID}
        productID={product._id}
        refreshData={refreshData}
      />

      <div className="container">
        <h1>{product.name}</h1>
        <div className="grid grid-cols-3 gap-5">{beneficiariesElement}</div>
      </div>
    </div>
  );
}
