import type { CommonCodeDetailData } from '@/api/data-contracts';
import { getOrderdDliveryType, getOrderStatus } from '@/service/common-api';
import { useQueries } from '@tanstack/react-query';

export function useOrderAndStatusAndDliveryTypeQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['orders'],
        queryFn: () => {
          return [];
        },
        staleTime: Infinity,
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
    rdersStatus: ordersStatusQuery.data,
    ordersDliveryType: ordersDliveryTypeQuery.data,
    isLoading:
      ordersQuery.isLoading || ordersStatusQuery.isLoading || ordersDliveryTypeQuery.isLoading,
    isError: ordersQuery.isError || ordersStatusQuery.isError || ordersDliveryTypeQuery.isError,
    error: ordersQuery.error || ordersStatusQuery.error || ordersDliveryTypeQuery.error,
  };
}
