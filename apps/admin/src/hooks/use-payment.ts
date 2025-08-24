import type { CommonCodeDetailData, PaymentsListData } from '@/api/data-contracts';
import { getOrderStatus } from '@/service/common-api';
import { getPaymentDetail, getPaymentsList, refundUpdate, updatePaid } from '@/service/payment';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 🔹 결제 리스트와 주문 상태를 동시에 조회
 * useQueries를 사용하여 여러 쿼리 병렬 실행
 */
export function usePaymentsWithOrderStatusQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['payments'],
        queryFn: getPaymentsList, // 결제 리스트 조회 API
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: PaymentsListData }).data,
      },
      {
        queryKey: ['ordersStatus', 'common'],
        queryFn: getOrderStatus, // 공통 주문 상태 조회 API
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
    ],
  });

  const [paymentsQuery, ordersStatusQuery] = results;

  return {
    paymentsList: paymentsQuery.data,
    ordersStatus: ordersStatusQuery.data,
    isLoading: paymentsQuery.isLoading || ordersStatusQuery.isLoading,
    isError: paymentsQuery.isError || ordersStatusQuery.isError,
    error: paymentsQuery.error || ordersStatusQuery.error,
  };
}

/**
 * 🔹 결제 리스트 조회
 */
export function usePaymentsListQuery() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentsList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

/**
 * 🔹 특정 결제 상세 조회
 * @param no 결제 번호
 */
export function usePaymentDetailQuery(no: number) {
  return useQuery({
    queryKey: ['payment', { no }],
    queryFn: getPaymentDetail, // 결제 상세 API 호출
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
    enabled: !!no, // no가 존재할 때만 실행
  });
}

/**
 * 🔹 입금 상태 업데이트 Mutation
 * 성공 시 관련 결제, 주문 데이터 캐시 무효화
 */
export function usePaidUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: updatePaid, // 입금 확인 업데이트 API
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', { no: variables.no }] });
      queryClient.invalidateQueries({ queryKey: ['order', { no: variables.data.orderNo }] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { paidUpdateMutation: mutateAsync, isError, error, isSuccess, isPending };
}
/**
 * 🔹 환불 상태 업데이트 Mutation
 * 성공 시 관련 결제, 주문 데이터 캐시 무효화
 */
export function useRefundUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: refundUpdate, // 환불 확인 업데이트 API
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', { no: variables.no }] });
      queryClient.invalidateQueries({ queryKey: ['order', { no: variables.data.orderNo }] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { refundUpdateMutation: mutateAsync, isError, error, isSuccess, isPending };
}
