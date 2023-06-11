import PageLayout from '@/components/PageLayout';
import Charities from '@/components/lists/Charities';

async function getCharities() {
  const response = await fetch(`${process.env.BASE_API_URL}/api/charities`, { cache: 'no-store' });
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  return data.records;
}

export default async function Home() {
  const charities = (await getCharities()) || [];
  return (
    <PageLayout showNav={true}>
      <Charities charities={charities} />
    </PageLayout>
  );
}
