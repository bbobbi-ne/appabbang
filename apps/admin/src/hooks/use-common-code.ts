import { getOrderStatus } from '@/service/common-api';
import { useQuery } from '@tanstack/react-query';

/**
 * 🔹 주문 상태 목록 조회
 * React Query 훅으로 공통 코드 'order_status' 데이터를 가져옵니다.
 * staleTime을 무한대로 설정하여 캐싱된 데이터를 재사용합니다.
 */
export function useGetOrderStatusQuery() {
  return useQuery({
    queryKey: ['orderStatus', 'common'],
    queryFn: getOrderStatus, // 실제 API 호출 함수
    staleTime: Infinity, // 캐시 무한 유지
    retry: 1, // 실패 시 1회 재시도
    select: (res) => res.data, // API 응답에서 data만 반환
  });
}
