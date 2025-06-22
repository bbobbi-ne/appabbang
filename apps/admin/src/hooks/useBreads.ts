import { createBread, deleteBread, getBreads, updateBread } from '@/service/breadApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useBreadQuery() {
  return useQuery({
    queryKey: ['breads'],
    queryFn: getBreads,
    staleTime: Infinity,
    retry: 1,
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
