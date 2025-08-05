import { useQuery } from '@tanstack/react-query';
import Infomation from '../home/infomation-content';
import InstagramContent from '../home/instagram-content';
import OrderContent from '../home/order-content';
import SellPopularProducts from '../home/sell-popular-products-content';
import { getLatest } from '@/services/apis';

function MainPage() {
  /************************************************************************/
  /** APIs */
  /** 1. 최신 주문차수 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['getLatest'],
    queryFn: getLatest,
  });
  /************************************************************************/
  if (isLoading) return <div>로딩중입니다...</div>;
  if (error || !data?.data) return <div>주문 정보를 불러오지 못했습니다.</div>;

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
