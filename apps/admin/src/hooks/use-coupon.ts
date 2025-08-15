import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CouponsUpdatePayload } from '@/api/data-contracts';
import {
  createCoupon,
  deleteCoupon,
  getCouponDetail,
  getCouponsList,
  issueCoupon,
  updateCoupon,
} from '@/service/coupon-api';

/** 훅: 쿠폰 목록 조회 */
export function useCouponsQuery() {
  return useQuery({
    queryKey: ['/coupons', '쿠폰 관리'],
    queryFn: getCouponsList,
    staleTime: Infinity,
    retry: 1,
  });
}

/** 훅: 쿠폰 상세 조회 */
export function useCouponDetailQuery(no: number) {
  return useQuery({
    queryKey: [`/coupons/${no}`, '쿠폰 상세 조회'],
    queryFn: () => getCouponDetail(no),
    staleTime: Infinity,
    retry: 1,
  });
}

/** 훅: 쿠폰 생성 */
export function useCouponCreateMutation() {
  const queryClient = useQueryClient();
  const createCouponMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/coupons'] });
    },
  });

  return createCouponMutation;
}

/** 훅: 쿠폰 수정 */
export function useCouponUpdateMutation(no: number) {
  const queryClient = useQueryClient();
  const updateCouponMutation = useMutation({
    mutationFn: (data: CouponsUpdatePayload) => updateCoupon(no, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/coupons'] });
    },
  });

  return updateCouponMutation;
}

/** 훅: 쿠폰 삭제 */
export function useCouponDeleteMutation(no: number) {
  const queryClient = useQueryClient();
  const deleteCouponMutation = useMutation({
    mutationFn: (no: number) => deleteCoupon(no),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/coupons'] });
    },
  });

  return deleteCouponMutation;
}

/** 훅: 쿠폰 발급 (쿠폰하나를 여러 고객에게 발급) */
export function useCouponIssueMutation(no: number) {
  // const queryClient = useQueryClient();
  const issueCouponMutation = useMutation({
    mutationFn: (noList: number[]) => issueCoupon(no, noList),
    onSuccess: () => {
      // TODO: 고객 refetch
      // queryClient.invalidateQueries({ queryKey: ['/customers'] });
    },
  });

  return issueCouponMutation;
}
