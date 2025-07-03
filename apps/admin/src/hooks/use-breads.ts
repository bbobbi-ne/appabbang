import {
  createBread,
  deleteBread,
  deleteBreadImg,
  getBread,
  getBreads,
  updateBread,
  getBreadStatus,
  updateBreadStatus,
  type Breads,
  type BreadStatusResponse,
} from '@/service/bread-api';
import type { ApiResponse } from '@/service/common';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetBreadsAndStatusQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['breads'],
        queryFn: getBreads,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as ApiResponse<Breads[]>).data,
      },
      {
        queryKey: ['breadStatus', 'common'],
        queryFn: getBreadStatus,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as ApiResponse<BreadStatusResponse>).data,
      },
    ],
  });

  const [breadsQuery, breadStatusQuery] = results;

  return {
    breads: breadsQuery.data,
    breadStatus: breadStatusQuery.data,
    isLoading: breadsQuery.isLoading || breadStatusQuery.isLoading,
    isError: breadsQuery.isError || breadStatusQuery.isError,
    error: breadsQuery.error || breadStatusQuery.error,
  };
}

export function useGetBreadQuery(no: number) {
  return useQuery({
    queryKey: ['bread', { no }],
    queryFn: getBread,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

export function useCreateBreadMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: createBread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { CreateBreadMutation: mutateAsync, isError, error, isSuccess, isPending };
}

export function useUpdateBreadMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isSuccess, error } = useMutation({
    mutationFn: updateBread,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });

      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { updateBreadMutation: mutateAsync, isError, isSuccess, error };
}

export function useUpdateBreadStatusMutation() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: updateBreadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { updateBreadStatusMutation: mutate, isError, isSuccess, error };
}

export function useDeleteBreadMutation() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteBread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { deleteBreadMutation: mutate };
}

export function useDeleteBreadImgMutation() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteBreadImg,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { deleteBreadImgMutation: mutate, isPending };
}
