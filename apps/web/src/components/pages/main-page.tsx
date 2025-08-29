import Infomation from '@/components/home/infomation-content';
import InstagramContent from '@/components/home/instagram-content';
import OrderRoundContent from '@/components/home/order-round-content';
import SellPopularProducts from '@/components/home/sell-popular-products-content';
import MainLoading from '@/components/home/loading';
import Loading from '@/components/common/loading';
import { useGetOrderRoundCurrentQuery } from '@/hooks/use-order-round';
import { useCheckHasOrderQuery } from '@/hooks/use-my';
import { useAccessTokenStore } from '@/store/session';

function MainPage() {
  /************************************************************************/
  const { accessToken } = useAccessTokenStore();

  /** APIs */
  const { data, isLoading, error } = useGetOrderRoundCurrentQuery();
  // 로그인 여부를 확인할 수 있는 다른 방법이 없을지?
  const { data: hasOrder } = useCheckHasOrderQuery(data?.no, data?.no && !!accessToken);

  /************************************************************************/
  if (isLoading) return <MainLoading />;
  if (error || !data) return <Loading />;

  return (
    <>
      <OrderRoundContent data={data} hasOrder={hasOrder} />
      <SellPopularProducts />
      <InstagramContent />
      <Infomation />
    </>
  );
}

export default MainPage;
