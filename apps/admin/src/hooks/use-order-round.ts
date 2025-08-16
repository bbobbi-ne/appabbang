import {
  createOrderRound,
  deleteOrderRoundImg,
  getDetailOrderRoundsList,
  getOrderRoundsList,
  updateOrderRound,
} from '@/service/order-round-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 🔹 주문차수 리스트 조회
 * React Query useQuery 훅
 */
export function useOrderRoundsQuery() {
  return useQuery({
    queryKey: ['order-rounds'], // 쿼리 키
    queryFn: getOrderRoundsList, // 주문차수 리스트 API 호출
    staleTime: Infinity, // 무한 캐싱
    retry: 1, // 실패 시 1회 재시도
    select: (res) => res.data, // API 응답에서 data만 선택
  });
}

/**
 * 🔹 특정 주문차수 상세 조회
 * @param no 주문차수 번호
 */
export function useOrderRoundDetailQuery(no: number) {
  return useQuery({
    queryKey: ['order-round', no], // 주문차수 단일 조회 키
    queryFn: () => getDetailOrderRoundsList(no), // 상세 API 호출
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
    enabled: !!no, // no가 존재할 때만 실행
  });
}

/**
 * 🔹 주문차수 생성 Mutation
 * 주문차수 생성 후 리스트 캐시 무효화
 */
export function useOrderRoundCreateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: createOrderRound, // 주문차수 생성 API
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-rounds'] }); // 리스트 캐시 무효화
    },
  });

  return { orderRoundCreateMutation: mutateAsync, isError, error, isSuccess, isPending };
}

/**
 * 🔹 주문차수 이미지 삭제 Mutation
 * 삭제 후 관련 캐시 무효화
 */
export function useOrderRoundImageDeleteMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: deleteOrderRoundImg,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-rounds'] });
      queryClient.invalidateQueries({ queryKey: ['order-round', { no: variables.no }] });
    },
  });

  return { orderRoundImageDeleteMutation: mutateAsync, isError, error, isSuccess, isPending };
}

/**
 * 🔹 주문차수 업데이트 Mutation
 * 수정 후 관련 캐시 무효화
 */
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
