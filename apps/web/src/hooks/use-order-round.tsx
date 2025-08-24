import { useQuery } from '@tanstack/react-query';
import { OrderRoundService } from '@/services/api/order-round-service';

export const useGetOrderRoundLatestQuery = () => {
  return useQuery({
    queryKey: ['/order-round/latest', '최신 주문차수'],
    queryFn: () => OrderRoundService.getLatest(),
  });
};

export const useGetOrderRoundNowQuery = () => {
  return useQuery({
    queryKey: ['/order-round/now', '현재 주문차수'],
    queryFn: () => OrderRoundService.getOrderRoundNow(),
  });
};

export const useGetOrderRoundQuery = (no: number) => {
  return useQuery({
    queryKey: ['/order-round', '특정 주문차수'],
    queryFn: () => OrderRoundService.getOrderRound(no),
  });
};
