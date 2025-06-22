import { getBreadStatus } from '@/service/commonApi';
import { useQuery } from '@tanstack/react-query';

export function useBreadStatus() {
  return useQuery({
    queryKey: ['breadStatus', 'common'],
    queryFn: getBreadStatus,
    staleTime: Infinity,
    retry: 1,
  });
}
