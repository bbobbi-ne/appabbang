import { createFileRoute } from '@tanstack/react-router';
import { CouponsPage } from '@/components/coupons/coupons-page';

export const Route = createFileRoute('/dashboard/coupons/')({
  component: CouponsPage,
});
