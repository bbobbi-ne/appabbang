import {
  createBread,
  deleteBread,
  deleteBreadImg,
  getBread,
  getBreads,
  updateBread,
  getBreadStatus,
} from '@/service/bread-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetBreadsQuery() {
  return useQuery({
    queryKey: ['breads'],
    queryFn: getBreads,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
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
  const { mutate, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: createBread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { CreateBreadMutation: mutate, isError, error, isSuccess, isPending };
}
export function useUpdateBreadMutation() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: updateBread,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });

      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { updateBreadMutation: mutate, isError, isSuccess, error };
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

export function useBreadStatus() {
  return useQuery({
    queryKey: ['breadStatus', 'common'],
    queryFn: getBreadStatus,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}
