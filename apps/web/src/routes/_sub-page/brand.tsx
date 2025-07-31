import { createFileRoute } from '@tanstack/react-router';
import BrandPage from '@/components/pages/brand-page';
import SubLayout from '@/components/templates/sub-layout';

export const Route = createFileRoute('/_sub-page/brand')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="브랜드 소개">
      <BrandPage />
    </SubLayout>
  );
}
