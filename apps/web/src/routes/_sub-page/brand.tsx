import { createFileRoute } from '@tanstack/react-router';
import BrandPage from '@/components/pages/brand-page';

export const Route = createFileRoute('/_sub-page/brand')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BrandPage />;
}
