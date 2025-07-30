import ProductsPage from '@/components/pages/products-page';
import SubLayout from '@/components/templates/sub-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/products')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="제품 소개">
      <ProductsPage />
    </SubLayout>
  );
}
