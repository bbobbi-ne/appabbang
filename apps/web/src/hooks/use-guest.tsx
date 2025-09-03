import type { GuestCreatePayload, GuestPwUpdatePayload } from '@/api/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GuestService } from '@/services/api/guest-service';

/** 비회원 주문목록 조회 mutation */
export function useGetGuestOrdersMutation() {
  const mutation = useMutation({
    mutationFn: (data: GuestCreatePayload) => GuestService.getGuestOrders(data),
  });

  return mutation;
}

/** 비회원 주문목록 조회 query */
export function useGetGuestOrdersQuery(data: GuestCreatePayload, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['/orders/guest/order-list', '비회원 주문목록 조회', data],
    queryFn: () => GuestService.getGuestOrders(data),
    enabled,
  });

  return query;
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

/** 비회원 배송(수령) 현황 조회 query */
export function useGetGuestOrderDeliveryQuery(no: number) {
  const query = useQuery({
    queryKey: [`/orders/guest/${no}/delivery`, '비회원 주문 배송(수령) 조회'],
    queryFn: () => GuestService.getOrderDelivery(no),
  });

  return query;
}

/** 비회원 주문 취소 */
export function useGuestCancelOrderMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: {
      no: number;
      data: { canceledReason: string };
      search?: {
        ordererName: string;
        ordererEmail: string;
        ordererMobile: string;
        orderPw: string;
      };
    }) => {
      const { no, data } = payload;
      return GuestService.cancelOrder(no, data);
    },
    onSuccess: (_, variables) => {
      if (variables.search) {
        queryClient.invalidateQueries({
          queryKey: ['/orders/guest/order-list'],
        });
      }
    },
  });

  return mutation;
}

/** 비회원 주문 비밀번호 찾기 */
export function useUpdateGuestOrderPwSendEmailMutation() {
  const mutation = useMutation({
    mutationFn: (data: GuestPwUpdatePayload) => GuestService.updateGuestOrderPwSendEmail(data),
  });

  return mutation;
}
