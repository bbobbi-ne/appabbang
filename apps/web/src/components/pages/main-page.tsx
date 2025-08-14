import { useQuery } from '@tanstack/react-query';
import Infomation from '../home/infomation-content';
import InstagramContent from '../home/instagram-content';
import OrderContent from '../home/order-content';
import SellPopularProducts from '../home/sell-popular-products-content';
import { getLatest } from '@/services/apis';
import MainLoading from '../home/loading';
import Loading from '../common/loading';

function MainPage() {
  /************************************************************************/
  /** APIs */
  /** 1. 최신 주문차수 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['getLatest'],
    queryFn: getLatest,
  });
  /************************************************************************/
  if (isLoading) return <MainLoading />;
  if (error || !data?.data) return <Loading />;

  return (
    <>
      <OrderContent data={data?.data} />
      <SellPopularProducts />
      <InstagramContent />
      <Infomation />
    </>
  );
}

export default MainPage;
