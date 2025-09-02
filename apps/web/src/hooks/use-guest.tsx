import type { GuestCreatePayload } from '@/api/data-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GuestService } from '@/services/api/guest-service';

/** 비회원 주문목록 조회 mutation */
export function useGetGuestOrdersMutation() {
  const mutation = useMutation({
    mutationFn: (data: GuestCreatePayload) => GuestService.getGuestOrders(data),
  });

  return mutation;
}

export function useGetGuestOrderQuery(no: number) {
  const query = useQuery({
    queryKey: [`/orders/guest/${no}`, '비회원 주문 상세 조회'],
    queryFn: () => GuestService.getGuestOrder(no),
  });

  return query;
}
