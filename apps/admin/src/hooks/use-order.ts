import type { CommonCodeDetailData, OrdersListData } from '@/api/data-contracts';
import { getOrderDeliveryType, getOrderStatus } from '@/service/common-api';
import { getOrdersDetail, getOrdersList, updateOrderStatus } from '@/service/order-api';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 🔹 주문 리스트, 주문 상태, 배송 타입 조회
 * useQueries를 사용하여 한번에 여러 쿼리 실행
 */
export function useOrdersWithStatusAndDeliveryQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['orders'],
        queryFn: getOrdersList, // 주문 리스트 조회 API
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: OrdersListData }).data, // 응답에서 data만 선택
      },
      {
        queryKey: ['ordersStatus', 'common'],
        queryFn: getOrderStatus, // 공통 주문 상태 조회 API
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
      {
        queryKey: ['ordersDeliveryType', 'common'],
        queryFn: getOrderDeliveryType, // 공통 배송 타입 조회 API (오타 수정)
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
    ],
  });

  const [ordersQuery, ordersStatusQuery, ordersDeliveryTypeQuery] = results;

  return {
    orders: ordersQuery.data,
    ordersStatus: ordersStatusQuery.data,
    ordersDeliveryType: ordersDeliveryTypeQuery.data,
    isLoading:
      ordersQuery.isLoading || ordersStatusQuery.isLoading || ordersDeliveryTypeQuery.isLoading,
    isError: ordersQuery.isError || ordersStatusQuery.isError || ordersDeliveryTypeQuery.isError,
    error: ordersQuery.error || ordersStatusQuery.error || ordersDeliveryTypeQuery.error,
  };
}

/**
 * 🔹 특정 주문 상세 조회
 * @param no 주문 번호
 */
export function useOrderDetailQuery(no: number) {
  return useQuery({
    queryKey: ['order', { no }],
    queryFn: getOrdersDetail, // 주문 상세 API 호출
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
    enabled: !!no, // no가 존재할 때만 실행
  });
}

/**
 * 🔹 주문 상태 업데이트 Mutation
 * 상태 업데이트 후 관련 캐시 무효화
 */
export function useOrderStatusUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: updateOrderStatus, // 주문 상태 업데이트 API
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // 주문 리스트 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['order', { no: variables.no }] }); // 해당 주문 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['payments'] }); // 결제 관련 캐시 무효화
    },
  });

  return { orderStatusUpdateMutation: mutate, isError, isSuccess, error };
}
