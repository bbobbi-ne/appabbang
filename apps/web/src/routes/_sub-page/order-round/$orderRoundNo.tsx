import { createFileRoute, redirect } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import OrderRoundDetailPage from '@/components/pages/order-round-detail-page';
import { OrderRoundService } from '@/services/api/order-round-service';
import { MyService } from '@/services/api/my-service';
import { useGetMyContactQuery } from '@/hooks/use-my';
import { useAccessTokenStore } from '@/store/session';

export const Route = createFileRoute('/_sub-page/order-round/$orderRoundNo')({
  beforeLoad: async ({ params }) => {
    const { orderRoundNo } = params;

    try {
      const isOpen = await OrderRoundService.checkOpenByNo(Number(orderRoundNo));

      if (!isOpen) {
        alert('해당 주문차수는 확인이 어렵습니다.');
        throw redirect({ to: '/' });
      }

      const hasOrder = await MyService.checkHasOrder(Number(orderRoundNo));

      if (hasOrder) {
        alert('이미 주문하신 주문이 있습니다. 마이페이지에서 주문내역을 확인해주세요.');
        throw redirect({ to: '/' });
      }
    } catch (error: any) {
      throw redirect({ to: '/' });
    }
  },
  loader: async ({ params }) => {
    const { orderRoundNo } = params;
    const orderRound = await OrderRoundService.getOpenOrderRound(Number(orderRoundNo));
    return orderRound;
  },
  component: RouteComponent,
});

function RouteComponent() {
  // 엑세스토큰 가져오기
  const store = useAccessTokenStore();
  // 로그인을 다르게 확인할 수 있는 방법은 없을까
  const { data: myContact } = useGetMyContactQuery({
    enabled: !!store.accessToken,
  });

  return (
    <SubLayout title="주문서">
      <OrderRoundDetailPage myContact={myContact} />
    </SubLayout>
  );
}
