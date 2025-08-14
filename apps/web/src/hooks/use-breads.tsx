import { useQuery } from '@tanstack/react-query';
import { BreadsService } from '@/services/api/breads-service';

/** 제품 소개 조회 */
export function useGetBreadsQuery() {
  return useQuery({
    queryKey: ['/breads', '제품 소개'],
    queryFn: () => BreadsService.getList(),
    staleTime: Infinity,
    retry: 3,
  });
}

/** 제품 상세 조회 */
export function useGetBreadQuery(no: number) {
  return useQuery({
    queryKey: [`/breads/${no}`, '제품 상세'],
    queryFn: () => BreadsService.getOne(no),
    staleTime: Infinity,
    retry: 3,
  });
}
