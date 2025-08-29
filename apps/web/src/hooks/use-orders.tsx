import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersService } from '@/services/api/orders-service';
import type { OrdersCreatePayload } from '@/api/data-contracts';

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OrdersCreatePayload) => OrdersService.create(data),
    retry: 3,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/my/orders', '내 주문 목록 조회'] });
      queryClient.invalidateQueries({
        queryKey: [`/my/order-rounds/${variables.orderRoundNo}/has-order`],
      });
    },
  });
}
