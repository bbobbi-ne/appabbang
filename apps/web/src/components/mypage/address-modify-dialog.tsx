import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@appabbang/ui';
import AddressForm, { type addresssDailogForm } from '@/components/mypage/address-form';
import type { AddressListData } from '../pages/address-page';
import { MyService } from '@/services/api/my-service';

type Props = {
  children: React.ReactNode;
  data: AddressListData[number] | undefined;
};

export default function AddressModifyDialog({ children, data }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { updateAddress } = MyService;

  const updateMutation = useMutation({
    mutationFn: (data: addresssDailogForm) => updateAddress(data.no, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAddresses'] });
      toast.success('변경이 완료되었습니다.');
      setOpen(false);
    },
  });

  /**
   * 배송지 수정
   */
  const update = async (data: addresssDailogForm) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (no: number) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(no);
        }, 2000);
      });
    },
  });

  const deleteAddress = async (no: number) => {
    try {
      await deleteMutation.mutateAsync(no);
      toast.success('삭제가 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['address'] });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          deleteAddress={deleteAddress}
          deleteLoading={deleteMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
