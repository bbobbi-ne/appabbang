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
import { useGetOrderAddressQuery, useUpdateOrderAddressMutation } from '@/hooks/use-my';

type Props = {
  children: React.ReactNode;
  no: number;
};

export default function OrderAddressModifyDialog({ children, no }: Props) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetOrderAddressQuery(no, open);
  const updateOrderAddressMutation = useUpdateOrderAddressMutation();

  /** 배송지 수정  */
  const updateOrderAddress = async (body: addresssDailogForm) => {
    try {
      if (!no) return;

      await updateOrderAddressMutation.mutateAsync({ no, data: body });
      toast.success('수정이 완료되었습니다.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <></>;

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
          <DialogTitle>주문 배송지 수정</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-xs">
          접수중인 주문의 배송지를 수정할 수 있습니다.
        </DialogDescription>
        <AddressForm
          currentValues={data}
          onSubmit={updateOrderAddress}
          isLoading={updateOrderAddressMutation.isPending}
          isHidden={true}
        />
      </DialogContent>
    </Dialog>
  );
}
