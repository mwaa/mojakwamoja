import PageLayout from '@/components/PageLayout';
import RedeemForm from '@/components/forms/RedeemForm';

const Home = ({ params }) => {
  const { productID } = params;

  return (
    <PageLayout showNav={true}>
      <RedeemForm productID={productID} />
    </PageLayout>
  );
};

export default Home;
