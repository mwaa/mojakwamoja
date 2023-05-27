import PageLayout from '@/components/PageLayout';
import Products from '@/components/lists/Products';

async function getCharitiesByID(charityID) {
  const response = await fetch(`http://localhost:3000/api/charities/${charityID}`, { cache: 'no-store' });
  // Recommendation: handle errors
  if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.record;
}

const Charity = async ({ params }) => {
  const charity = await getCharitiesByID(params.charityID) || { PRODUCTS: [] }

  console.log('We got ', params.charityID, charity);

  return (
    <PageLayout showNav={true}>
      <Products charity={charity} />
    </PageLayout>
  );
};

export default Charity;
