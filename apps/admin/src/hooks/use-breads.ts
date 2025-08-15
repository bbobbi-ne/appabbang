import type { BreadsListData } from '@/api/data-contracts';
import {
  breadsCreate,
  breadsDelete,
  imageDelete,
  getBreads,
  breadsUpdate,
  breadsDetail,
} from '@/service/bread-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** 🔹 빵 목록 조회 */
export function useGetBreadsQuery() {
  return useQuery({
    queryKey: ['breads'],
    queryFn: getBreads,
    staleTime: Infinity,
    retry: 1,
    select: (res) => (res as { data: BreadsListData }).data,
  });
}

/** 🔹 단일 빵 정보 조회 */
export function useGetBreadDetailQuery(no: number) {
  return useQuery({
    queryKey: ['bread', { no }],
    queryFn: breadsDetail,
    staleTime: Infinity,
    enabled: !!no,
    retry: 1,
    select: (res) => res.data,
  });
}

/** 🔹 빵 생성 */
export function useCreateBreadMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: breadsCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { createBread: mutation.mutateAsync, ...mutation };
}

/** 🔹 빵 업데이트 */
export function useUpdateBreadMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: breadsUpdate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { updateBread: mutation.mutateAsync, ...mutation };
}

/** 🔹 빵 삭제 */
export function useDeleteBreadMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: breadsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { deleteBread: mutation.mutate, ...mutation };
}

/** 🔹 빵 이미지 삭제 */
export function useDeleteBreadImageMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: imageDelete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { deleteBreadImage: mutation.mutate, ...mutation };
}
