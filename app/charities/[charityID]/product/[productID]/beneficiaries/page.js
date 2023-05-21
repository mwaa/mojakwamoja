import { Beneficiaries } from '@/components/lists/Beneficiaries';
import PageLayout from '@/components/PageLayout';

async function getData(charityID, productID) {
  const response = await fetch(`http://localhost:3000/api/charities/${charityID}/product/${productID}`, { cache: 'no-store' });
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
  const product = await getData(charityID, productID) || {};
  console.log(product);

  return (
    <PageLayout showNav={true}>
      <Beneficiaries
        charityID={charityID}
        product={product}
      />
    </PageLayout>
  );
};

export default ProductBeneficiaries;
