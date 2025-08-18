import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import CustomerInfoCard from '@/components/mypage/customer-info-card';
import OrderListPage from '@/components/pages/order-list-page';

export const Route = createFileRoute('/_sub-page/mypage/order-list/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard />
      <OrderListPage />
    </SubLayout>
  );
}
