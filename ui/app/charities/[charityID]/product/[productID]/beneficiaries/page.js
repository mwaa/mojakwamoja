import { Beneficiaries } from '@/components/lists/Beneficiaries';
import PageLayout from '@/components/PageLayout';
import { revalidatePath } from 'next/cache';

async function getData(charityID, productID) {
  const response = await fetch(
    `${process.env.BASE_API_URL}/api/charities/${charityID}/product/${productID}`,
    { cache: 'no-store' }
  );
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.record;
}

const ProductBeneficiaries = async ({ params }) => {
  const { charityID, productID } = params;
  const product = (await getData(charityID, productID)) || {};

  const refreshData = async () => {
    'use server';
    revalidatePath('/charities/[charityID]/product/[productID]/beneficiaries');
  };

  return (
    <PageLayout showNav={true}>
      <Beneficiaries charityID={charityID} product={product} refreshData={refreshData} />
    </PageLayout>
  );
};

export default ProductBeneficiaries;
