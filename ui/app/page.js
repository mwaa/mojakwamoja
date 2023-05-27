import PageLayout from '@/components/PageLayout';
import DonateCard from '@/components/display/DonateCard';
import Search from '@/components/forms/Search';

async function getProducts() {
  const response = await fetch(`http://localhost:3000/api/products`, { cache: 'no-store' });
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.records;
}

const Donate = async () => {
  const products = (await getProducts()) || [];
  return (
    <PageLayout showNav={true}>
      <div className="container mx-auto">
        <Search />
        <div className="grid grid-cols-3 gap-5">
          {products &&
            products.map((product) => <DonateCard key={product._id} product={product} />)}
        </div>
      </div>
    </PageLayout>
  );
};

export default Donate;
