/**
 * 게스트 - 주문내역 - 주문상세내역
 */

import GuestOrderDetail from '@/components/guest/order-detail';
import SubLayout from '@/components/templates/sub-layout';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/guest/order-list/$orderNo')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderNo } = useParams({ from: '/_sub-page/guest/order-list/$orderNo' }); // 파라미터

  return (
    <SubLayout title="비회원 주문목록">
      <GuestOrderDetail orderNo={Number(orderNo)} />
    </SubLayout>
  );
}
