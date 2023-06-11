import PageLayout from '@/components/PageLayout';
import Products from '@/components/lists/Products';
import { revalidatePath } from 'next/cache';

async function getCharitiesByID(charityID) {
  const response = await fetch(`${process.env.BASE_API_URL}/api/charities/${charityID}`, {
    cache: 'no-store'
  });
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.record;
}

const Charity = async ({ params }) => {
  const charity = (await getCharitiesByID(params.charityID)) || { PRODUCTS: [] };

  const refreshData = async () => {
    'use server';
    revalidatePath('/charities/[charityID]');
  };

  return (
    <PageLayout showNav={true}>
      <Products charity={charity} refreshData={refreshData} />
    </PageLayout>
  );
};

export default Charity;
