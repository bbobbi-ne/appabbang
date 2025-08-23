import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import AddressForm from '@/components/mypage/address-form';
import type { addresssDailogForm } from '@/validate/address-form.schema';
import type { AddressesListData } from '@/api/data-contracts';

type Props = {
  children: React.ReactNode;
  data: AddressesListData[number] | undefined;
  update: {
    mutationAsync: ({ no, data }: { no: number; data: addresssDailogForm }) => Promise<void>;
    isSubmitting: boolean;
  };
  remove?: {
    mutationAsync: (no: number) => Promise<void>;
    isSubmitting: boolean;
  };
};

export default function AddressModifyDialog({ children, data, update, remove }: Props) {
  const [open, setOpen] = useState(false);

  /** 배송지 수정  */
  const updateAddress = async (body: addresssDailogForm) => {
    try {
      if (!update || !data?.no) return;

      await update.mutationAsync({ no: data.no, data: body });
      toast.success('수정이 완료되었습니다.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /** 배송지 삭제  */
  const deleteAddress = async (no: number) => {
    try {
      if (!remove) return;

      await remove.mutationAsync(no); // 배송지변경에서 온 배송지 삭제
      toast.success('삭제가 완료되었습니다.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
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
          onSubmit={updateAddress}
          isLoading={update.isSubmitting}
          deleteAddress={deleteAddress}
          deleteLoading={remove?.isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
