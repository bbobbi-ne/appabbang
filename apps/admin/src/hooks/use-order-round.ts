import {
  createOrderRound,
  deleteOrderRoundImg,
  getDetailOrderRoundsList,
  getOrderRoundsList,
  updateOrderRound,
} from '@/service/order-round-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrderRoundsQuery() {
  return useQuery({
    queryKey: ['order-rounds'],
    queryFn: getOrderRoundsList,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
export function useOrderRoundDetailQuery(no: number) {
  return useQuery({
    queryKey: ['order-round', no],
    queryFn: () => getDetailOrderRoundsList(no),
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
export function useOrderRoundCreateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: createOrderRound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-rounds'] });
    },
  });

  return { orderRoundCreateMutation: mutateAsync, isError, error, isSuccess, isPending };
}

export function useOrderRoundImgDeleteMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: deleteOrderRoundImg,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-rounds'] });
      queryClient.invalidateQueries({ queryKey: ['order-round', { no: variables.no }] });
    },
  });
  return { orderRoundImgDeleteMutation: mutateAsync, isError, error, isSuccess, isPending };
}
export function useOrderRoundUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: updateOrderRound,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-rounds'] });
      queryClient.invalidateQueries({ queryKey: ['order-round', { no: variables.no }] });
    },
  });
  return { orderRoundUpdateMutation: mutateAsync, isError, error, isSuccess, isPending };
}
