import { useMutation } from '@tanstack/react-query';
import { OrdersService } from '@/services/api/orders-service';
import type { OrdersCreatePayload } from '@/api/data-contracts';

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (data: OrdersCreatePayload) => OrdersService.create(data),
    retry: 3,
  });
}
