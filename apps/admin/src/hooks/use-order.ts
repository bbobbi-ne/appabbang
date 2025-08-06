import type { CommonCodeDetailData, OrdersListData } from '@/api/data-contracts';
import { getOrderdDliveryType, getOrderStatus } from '@/service/common-api';
import { getOrdersDetail, getOrdersList, updateOrderStatus } from '@/service/order-api';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrderAndStatusAndDliveryTypeQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['orders'],
        queryFn: getOrdersList,
        staleTime: Infinity,
        select: (res) => (res as { data: OrdersListData }).data,
        retry: 1,
      },
      {
        queryKey: ['ordersStatus', 'common'],
        queryFn: getOrderStatus,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
      {
        queryKey: ['ordersDliveryType', 'common'],
        queryFn: getOrderdDliveryType,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
      },
    ],
  });

  const [ordersQuery, ordersStatusQuery, ordersDliveryTypeQuery] = results;

  return {
    orders: ordersQuery.data,
    ordersStatus: ordersStatusQuery.data,
    ordersDliveryType: ordersDliveryTypeQuery.data,
    isLoading:
      ordersQuery.isLoading || ordersStatusQuery.isLoading || ordersDliveryTypeQuery.isLoading,
    isError: ordersQuery.isError || ordersStatusQuery.isError || ordersDliveryTypeQuery.isError,
    error: ordersQuery.error || ordersStatusQuery.error || ordersDliveryTypeQuery.error,
  };
}

export function useOrdersDetailQuery(no: number) {
  return useQuery({
    queryKey: ['bread', { no }],
    queryFn: getOrdersDetail,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

export function useOrderStatusUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { orderStatusUpdateMutation: mutate, isError, isSuccess, error };
}
