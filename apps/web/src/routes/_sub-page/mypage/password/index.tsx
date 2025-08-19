import { createFileRoute } from '@tanstack/react-router';
import PasswordPage from '@/components/pages/password-page';
import SubLayout from '@/components/templates/sub-layout';
import CustomerInfoCard from '@/components/mypage/customer-info-card';

export const Route = createFileRoute('/_sub-page/mypage/password/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard />
      <PasswordPage />
    </SubLayout>
  );
}
