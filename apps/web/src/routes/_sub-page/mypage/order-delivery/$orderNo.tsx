import OrderDeliveryPage from '@/components/pages/order-delivery-page';
import SubLayout from '@/components/templates/sub-layout';
import MypageLayout from '@/components/templates/mypage-layout';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/mypage/order-delivery/$orderNo')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderNo } = useParams({ from: '/_sub-page/mypage/order-delivery/$orderNo' }); // 파라미터

  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <OrderDeliveryPage orderNo={Number(orderNo)} />
      </MypageLayout>
    </SubLayout>
  );
}
