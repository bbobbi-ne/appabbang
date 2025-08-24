import { createFileRoute, useParams } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import MypageLayout from '@/components/templates/mypage-layout';
import MyOrderDeliveryPage from '@/components/pages/my-order-delivery-page';

export const Route = createFileRoute('/_sub-page/mypage/order-list_/$orderNo/delivery')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderNo } = useParams({ from: '/_sub-page/mypage/order-list_/$orderNo/delivery' });

  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <MyOrderDeliveryPage orderNo={Number(orderNo)} />
      </MypageLayout>
    </SubLayout>
  );
}
