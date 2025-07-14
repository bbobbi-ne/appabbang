import type { BreadsListData, CommonCodeDetailData } from '@/api/data-contracts';
import {
  breadsCreate,
  breadsDelete,
  imageDelete,
  getBreads,
  breadsUpdate,
  statusUpdate,
  breadsDetail,
} from '@/service/bread-api';
import { getBreadStatus } from '@/service/common-api';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetBreadsAndStatusQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['breads'],
        queryFn: getBreads,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: BreadsListData }).data,
      },
      {
        queryKey: ['breadStatus', 'common'],
        queryFn: getBreadStatus,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as { data: CommonCodeDetailData }).data,
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

export function useBreadsDetailQuery(no: number) {
  return useQuery({
    queryKey: ['bread', { no }],
    queryFn: breadsDetail,
    staleTime: Infinity,
    retry: 1,
    select: (res) => res.data,
  });
}

export function useBreadsCreateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isSuccess, isPending } = useMutation({
    mutationFn: breadsCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { breadsCreateMutation: mutateAsync, isError, error, isSuccess, isPending };
}

export function useBreadsUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isSuccess, error } = useMutation({
    mutationFn: breadsUpdate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { breadsUpdateMutation: mutateAsync, isError, isSuccess, error };
}

export function useStatusUpdateMutation() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: statusUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { statusUpdateMutation: mutate, isError, isSuccess, error };
}

export function useBreadsDeleteMutation() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: breadsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
    },
  });

  return { deleteBreadMutation: mutate };
}

export function useimageDeleteMutation() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: imageDelete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['breads'] });
      queryClient.invalidateQueries({ queryKey: ['bread', { no: variables.no }] });
    },
  });

  return { imageDeleteMutation: mutate, isPending };
}
