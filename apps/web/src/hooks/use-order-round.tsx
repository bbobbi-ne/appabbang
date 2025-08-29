import { useQuery } from '@tanstack/react-query';
import { OrderRoundService } from '@/services/api/order-round-service';

/** 현재 주문차수 조회 */
export const useGetOrderRoundCurrentQuery = () => {
  return useQuery({
    queryKey: ['/order-round/current', '메인페이지'],
    queryFn: () => OrderRoundService.getOrderRoundCurrent(),
  });
};

/** 주문차수가 진행중인지 확인 */
export const useCheckOpenByNoQuery = (no: number) => {
  return useQuery({
    queryKey: [`/order-round/${no}/is-open`, `주문차수상세`],
    queryFn: () => OrderRoundService.checkOpenByNo(no),
    enabled: !!no,
  });
};

/** 오픈된 특정 주문차수 조회 */
export const useGetOpenOrderRoundQuery = (no: number) => {
  return useQuery({
    queryKey: [`/order-round/${no}/open`, '주문차수상세'],
    queryFn: () => OrderRoundService.getOpenOrderRound(no),
    enabled: !!no,
  });
};
