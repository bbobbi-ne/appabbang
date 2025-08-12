import type { CommonCodeDetailData, PaymentsListData } from '@/api/data-contracts';
import { getOrderStatus } from '@/service/common-api';
import { getPaymentDetail, getPaymentsList, updatePaid } from '@/service/payment';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePaymentsListAndOrderStatusQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['payments'],
        queryFn: getPaymentsList,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: PaymentsListData }).data,
      },
      {
        queryKey: ['ordersStatus', 'common'],
        queryFn: getOrderStatus,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
    ],
  });

  const [paymentListsQuery, ordersStatusQuery] = results;

  return {
    paymentsList: paymentListsQuery.data,
    ordersStatus: ordersStatusQuery.data,
    isLoading: paymentListsQuery.isLoading || ordersStatusQuery.isLoading,
    isError: paymentListsQuery.isError || ordersStatusQuery.isError,
    error: paymentListsQuery.error || ordersStatusQuery.error,
  };
}

export function usePaymentsListQuery() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentsList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

export function usePaymenDetailQuery(no: number) {
  return useQuery({
    queryKey: ['payment', { no }],
    queryFn: getPaymentDetail,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

export function usePaidUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: updatePaid,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', { no: variables.no }] });
      queryClient.invalidateQueries({ queryKey: ['order', { no: variables.data.orderNo }] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
  return { paidUpdateMutation: mutateAsync, isError, error, isSuccess, isPending };
}
