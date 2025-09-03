/**
 * 비회원 배송현황 페이지
 */
import GuestDeliveryDetail from '@/components/guest/delivery';
import SubLayout from '@/components/templates/sub-layout';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/guest/order-list_/$orderNo/delivery')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderNo } = useParams({ from: '/_sub-page/guest/order-list_/$orderNo/delivery' });

  return (
    <SubLayout title="비회원 주문목록">
      <GuestDeliveryDetail orderNo={Number(orderNo)} />
    </SubLayout>
  );
}
