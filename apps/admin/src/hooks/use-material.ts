import type { ApiResponse } from '@/service/common';
import { getMaterialType, type MaterialTypeResponse } from '@/service/material-api';
import { useQueries } from '@tanstack/react-query';

export function useMaterialAndTypeQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['material'],
        queryFn: () => {
          return [];
        },
        staleTime: Infinity,
        retry: 1,
      },
      {
        queryKey: ['materialType', 'common'],
        queryFn: getMaterialType,
        staleTime: Infinity,
        retry: 1,
        select: (res) => (res as ApiResponse<MaterialTypeResponse>).data,
      },
    ],
  });

  const [materialsQuery, materialTypeQuery] = results;

  return {
    materials: materialsQuery.data,
    materialType: materialTypeQuery.data,
    isLoading: materialsQuery.isLoading || materialTypeQuery.isLoading,
    isError: materialsQuery.isError || materialTypeQuery.isError,
    error: materialsQuery.error || materialTypeQuery.error,
  };
}
