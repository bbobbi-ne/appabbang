import { getOrderRoundsList } from '@/service/order-round-api';
import { useQuery } from '@tanstack/react-query';

export function useOrderRoundsQuery() {
  return useQuery({
    queryKey: ['order-round'],
    queryFn: getOrderRoundsList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
