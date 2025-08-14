import { useQuery } from '@tanstack/react-query';
import type { CouponsListData } from '@/api/data-contracts';
import { getCouponsList } from '@/service/coupon-api';

export function useCouponsQuery() {
  return useQuery({
    queryKey: ['/coupons', '쿠폰 관리'],
    queryFn: getCouponsList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => (res as { data: CouponsListData }).data,
  });
}
