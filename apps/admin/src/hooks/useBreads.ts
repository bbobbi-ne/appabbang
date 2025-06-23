import {
  createBread,
  deleteBread,
  deleteBreadImg,
  getBreads,
  updateBread,
} from '@/service/breadApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetBreadsQuery() {
  return useQuery({
    queryKey: ['breads'],
    queryFn: getBreads,
    staleTime: Infinity,
    retry: 1,
    select: (data) => data.breads,
  });
}

export function useGetBreadQuery(no: number) {
  return useQuery({
    queryKey: ['bread', { no }],
    queryFn: getBreads,
    staleTime: Infinity,
    retry: 1,
    select: (data) => data.breads,
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
  const { mutate } = useMutation({
    mutationFn: updateBread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { updateBreadMutation: mutate };
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
