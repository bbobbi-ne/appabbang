import { getCustomerList } from '@/service/customer-api';
import { useQuery } from '@tanstack/react-query';

export function useCustomersListQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomerList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
