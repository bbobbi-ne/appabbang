import Infomation from '@/components/home/infomation-content';
import InstagramContent from '@/components/home/instagram-content';
import OrderRoundContent from '@/components/home/order-round-content';
import SellPopularProducts from '@/components/home/sell-popular-products-content';
import MainLoading from '@/components/home/loading';
import Loading from '@/components/common/loading';
import { useGetOrderRoundLatestQuery } from '@/hooks/use-order-round';

function MainPage() {
  /************************************************************************/
  /** APIs */
  /** 1. 최신 주문차수 조회 API */
  const { isLoading, data, error } = useGetOrderRoundLatestQuery();
  /************************************************************************/
  if (isLoading) return <MainLoading />;
  if (error || !data) return <Loading />;

  return (
    <>
      <OrderRoundContent data={data} />
      <SellPopularProducts />
      <InstagramContent />
      <Infomation />
    </>
  );
}

export default MainPage;
