import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MyService } from '@/services/api/my-service';

/** 배송지 목록 조회 */
export function useGetAddressListQuery() {
  return useQuery({
    queryKey: ['/my/addresses', '마이페이지 > 배송지관리'],
    queryFn: () => MyService.getAddressList(),
    staleTime: Infinity,
    retry: 3,
  });
}

/** 배송지 상세 조회 */
export function useGetAddressOneQuery(no: number) {
  return useQuery({
    queryKey: [`/my/addresses/${no}`, '마이페이지 >배송지 상세'],
    queryFn: () => MyService.getAddressOne(no),
    staleTime: Infinity,
    retry: 3,
  });
}

/** 배송지 생성 */
export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  const createAddressMutation = useMutation({
    mutationFn: (data: any) => MyService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return createAddressMutation;
}

/** 배송지 수정 */
export function useUpdateAddressMutation(no: number) {
  const queryClient = useQueryClient();
  const updateAddressMutation = useMutation({
    mutationFn: (data: any) => MyService.updateAddress(no, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return updateAddressMutation;
}

/** 배송지 삭제 */
export function useDeleteAddressMutation(no: number) {
  const queryClient = useQueryClient();
  const deleteAddressMutation = useMutation({
    mutationFn: () => MyService.deleteAddress(no),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/my/addresses'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return deleteAddressMutation;
}
