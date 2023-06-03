import PageLayout from '@/components/PageLayout';
import RedeemForm from '@/components/forms/RedeemForm';

async function getProducts() {
  const response = await fetch(`${process.env.BASE_API_URL}/api/products`, { cache: 'no-store' });
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.records;
}

const Redeem = async () => {
  const products = (await getProducts()) || [];

  return (
    <PageLayout showNav={true}>
      <RedeemForm products={products} />
    </PageLayout>
  );
};

export default Redeem;
