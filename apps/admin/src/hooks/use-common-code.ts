import { getOrderStatus } from '@/service/common-api';
import { useQuery } from '@tanstack/react-query';

export function useGetOrderStatusQuery() {
  return useQuery({
    queryKey: ['ordersStatus', 'common'],
    queryFn: getOrderStatus,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
