import { useState } from 'react';
import { toast } from '@appabbang/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import AddressForm from '@/components/mypage/address-form';
import type { AddressListData } from '../pages/address-page';
import { MyService } from '@/services/api/my-service';
import type { addresssDailogForm } from '@/validate/address-form.schema';

type Props = {
  children: React.ReactNode;
  data: AddressListData[number] | undefined;
  ORDER_DETAIL?: boolean;
};

export default function AddressModifyDialog({ children, data, ORDER_DETAIL }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { updateAddress, deleteAddress, updateOrderAddr } = MyService;

  /** 배송지 수정 Mutation */
  const updateMutation = useMutation({
    mutationFn: (data: addresssDailogForm) => updateAddress(data.no!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAddresses'] });
      toast.success('변경이 완료되었습니다.');
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  /** 주문상세내역 : 배송지 수정 */
  const updateOrderAddrMutation = useMutation({
    mutationFn: (data: addresssDailogForm) => updateOrderAddr(data.no!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAddresses'] });
      toast.success('변경이 완료되었습니다.');
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  /** 배송지 수정 */
  const update = async (data: addresssDailogForm) => {
    ORDER_DETAIL
      ? await updateOrderAddrMutation.mutateAsync(data)
      : await updateMutation.mutateAsync(data);
  };

  /** 배송지 삭제 Mutation  */
  const deleteMutation = useMutation({
    mutationFn: (no: number) => deleteAddress(no),
    onSuccess: () => {
      toast.success('삭제가 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['address'] });
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  /** 배송지 삭제  */
  const deleteAddr = async (no: number) => {
    await deleteMutation.mutateAsync(no); // 배송지변경에서 온 배송지 삭제
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogDescription className="hidden" />
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>배송지 수정</DialogTitle>
        </DialogHeader>
        <AddressForm
          currentValues={data}
          onSubmit={update}
          isLoading={updateMutation.isPending}
          deleteAddress={deleteAddr}
          deleteLoading={deleteMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
