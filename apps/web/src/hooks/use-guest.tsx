import type { GuestCreatePayload } from '@/api/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GuestService } from '@/services/api/guest-service';

/** 비회원 주문목록 조회 mutation */
export function useGetGuestOrdersMutation() {
  const mutation = useMutation({
    mutationFn: (data: GuestCreatePayload) => GuestService.getGuestOrders(data),
  });

  return mutation;
}

/** 비회원 주문 상세조회 query */
export function useGetGuestOrderQuery(no: number) {
  const query = useQuery({
    queryKey: [`/orders/guest/${no}`, '비회원 주문 상세 조회'],
    queryFn: () => GuestService.getGuestOrder(no),
  });

  return query;
}

/** 비회원 주문 상세내역의 배송지 조회 query */
export function useGetGuestOrderAddressQuery(no: number, enabled: boolean) {
  return useQuery({
    queryKey: [`/orders/guest/${no}/address`, '주문내역의 배송지 조회'],
    queryFn: () => GuestService.getOrderAddress(no),
    enabled,
  });
}

/** 비회원 주문 상세내역의 배송지 수정 mutation */
export function updateGuestOrderAddressMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ no, data }: { no: number; data: any }) =>
      GuestService.updateOrderAddress(no, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`/orders/guest/${variables.no}/address`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/orders/guest/${variables.no}`],
      });
    },
  });

  return mutation;
}
