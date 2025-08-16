import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import CustomerInfoCard from '@/components/mypage/customer-info-card';
import AddressPage from '@/components/pages/address-page';

/** 배송지 관리 */
export const Route = createFileRoute('/_sub-page/mypage/address/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard />
      <AddressPage />
    </SubLayout>
  );
}
