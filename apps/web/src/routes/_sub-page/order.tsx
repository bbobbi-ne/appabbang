/**
 * [ 주문서 ]
 * 로그인 세션을 서버로부터 호출하여 세션 존재유무에 따라 보여지는 화면.
 */

import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import OrderPage from '@/components/pages/order-page';

export const Route = createFileRoute('/_sub-page/order')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="주문서">
      <OrderPage />
    </SubLayout>
  );
}
