/**
 * 마이페이지 - 주문내역 - 주문상세내역
 */

import MyOrderDetailPage from '@/components/pages/my-order-detail-page';
import SubLayout from '@/components/templates/sub-layout';
import MypageLayout from '@/components/templates/mypage-layout';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/mypage/order-list/$orderNo')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderNo } = useParams({ from: '/_sub-page/mypage/order-list/$orderNo' }); // 파라미터

  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <MyOrderDetailPage orderNo={Number(orderNo)} />
      </MypageLayout>
    </SubLayout>
  );
}
