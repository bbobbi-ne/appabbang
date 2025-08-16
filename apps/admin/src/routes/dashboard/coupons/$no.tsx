import { createFileRoute } from '@tanstack/react-router';
import { CouponDetailPage } from '@/components/coupons/coupon-detail-page';

export const Route = createFileRoute('/dashboard/coupons/$no')({
  component: CouponDetailPage,
});
