/**
 * 마이페이지 - 정보수정
 */

import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import InfoPage from '@/components/pages/info-page';
import CustomerInfoCard from '@/components/mypage/customer-info-card';

export const Route = createFileRoute('/_sub-page/mypage/info/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard />
      <InfoPage />
    </SubLayout>
  );
}
