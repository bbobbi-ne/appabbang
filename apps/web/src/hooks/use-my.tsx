import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MyService } from '@/services/api/my-service';
import type { UpdateMyPasswordPayload, UpdateMyProfilePayload } from '@/api/data-contracts';

/** 고객 요약정보 조회 */
export function useGetCustomerSummaryQuery() {
  return useQuery({
    queryKey: ['/my/summary', '내 요약정보 조회'],
    queryFn: MyService.getCustomerSummaryInfo,
  });
}

/** 고객 정보 조회 */
export function useGetCustomerInfoQuery() {
  return useQuery({
    queryKey: ['/my', '내 정보 조회'],
    queryFn: MyService.getCustomerInfo,
  });
}

/** 내 연락처 조회 */
export function useGetMyContactQuery({ enabled = true }: { enabled: boolean }) {
  return useQuery({
    queryKey: ['/my/contact', '내 연락처 조회'],
    queryFn: MyService.getMyContact,
    enabled,
  });
}

/** 고객 정보 수정 */
export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyProfilePayload) => MyService.updateCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my', '내 정보 조회'] });
      queryClient.invalidateQueries({ queryKey: ['/my/contact', '내 연락처 조회'] });
    },
  });
}

/** 고객 비밀번호 수정 */
export function useUpdateCustomerPwMutation() {
  return useMutation({
    mutationFn: (data: UpdateMyPasswordPayload) => MyService.updateCustomerPw(data),
  });
}

/** 배송지 목록 조회 */
export function useGetAddressListQuery() {
  return useQuery({
    queryKey: ['/my/addresses', '마이페이지 > 배송지관리'],
    queryFn: () => MyService.getAddressList(),
  });
}

/** 배송지 상세 조회 */
export function useGetAddressOneQuery(no: number) {
  return useQuery({
    queryKey: [`/my/addresses/${no}`, '마이페이지 >배송지 상세'],
    queryFn: () => MyService.getAddressOne(no),
  });
}

/** 배송지 생성 */
export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  const createAddressMutation = useMutation({
    mutationFn: (data: any) => MyService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses', '마이페이지 > 배송지관리'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return createAddressMutation;
}

/** 배송지 수정 */
export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  const updateAddressMutation = useMutation({
    mutationFn: ({ no, data }: { no: number; data: any }) => MyService.updateAddress(no, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses', '마이페이지 > 배송지관리'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return updateAddressMutation;
}

/** 배송지 삭제 */
export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  const deleteAddressMutation = useMutation({
    mutationFn: (no: number) => MyService.deleteAddress(no),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return deleteAddressMutation;
}

/** 내 주문 목록 조회 */
export function useGetOrdersQuery() {
  return useQuery({
    queryKey: ['/my/orders', '내 주문 목록 조회'],
    queryFn: () => MyService.getOrders(),
  });
}

/** 내 주문 상세 조회 */
export function useGetOrderQuery(no: number) {
  return useQuery({
    queryKey: [`/my/orders/${no}`, '내 주문 상세 조회'],
    queryFn: () => MyService.getOrder(no),
  });
}

/** 내 주문 취소 */
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      no: number;
      data: { canceledReason: string };
      orderRoundNo: number;
    }) => {
      const { no, data } = payload;
      return MyService.cancelOrder(no, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/my/orders'] });
      queryClient.invalidateQueries({
        queryKey: [`/my/order-rounds/${variables.orderRoundNo}/has-order`],
      });
    },
  });
}

/** 내 주문 배송(수령) 조회 */
export function useGetOrderDeliveryQuery(no: number) {
  return useQuery({
    queryKey: [`/my/orders/${no}/delivery`, '내 주문 배송(수령) 조회'],
    queryFn: () => MyService.getOrderDelivery(no),
  });
}

/** 주문내역의 배송지 조회 */
export function useGetOrderAddressQuery(no: number, enabled: boolean) {
  return useQuery({
    queryKey: [`/my/orders/${no}/address`, '주문내역의 배송지 조회'],
    queryFn: () => MyService.getOrderAddress(no),
    enabled,
  });
}

/** 주문내역의 배송지 수정 */
export function useUpdateOrderAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ no, data }: { no: number; data: any }) => MyService.updateOrderAddress(no, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`/my/orders/${variables.no}/address`, '주문내역의 배송지 조회'],
      });
    },
  });
}

/** 주문차수에 내 주문이 있는지 확인 (취소, 환불 제외) */
export const useCheckHasOrderQuery = (no: number, enabled = false) => {
  return useQuery({
    queryKey: [`/my/order-rounds/${no}/has-order`, '내 주문 상세 조회'],
    queryFn: () => MyService.checkHasOrder(no),
    enabled,
  });
};

/** 현재 보유하고 있는 쿠폰 조회 */
export function useGetCouponQuery() {
  return useQuery({
    queryKey: ['/my/coupons', '마이페이지 > 쿠폰내역'],
    queryFn: () => MyService.getCouponList(),
  });
}

/** 내 사용 가능한 쿠폰 조회 */
export function useGetAvailableCouponQuery({ enabled = true }: { enabled: boolean }) {
  return useQuery({
    queryKey: ['/my/coupons/available', '마이페이지 > 사용 가능한 쿠폰'],
    queryFn: () => MyService.getAvailableCouponList(),
    enabled,
  });
}
