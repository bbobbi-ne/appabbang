import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import OrderListPage from '@/components/pages/order-list-page';
import MypageLayout from '@/components/templates/mypage-layout';

export const Route = createFileRoute('/_sub-page/mypage/order-list/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <OrderListPage />
      </MypageLayout>
    </SubLayout>
  );
}
