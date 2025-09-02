import { useState } from 'react';
import { toast } from '@appabbang/ui';
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
import type { OrdersAddressListData } from '@/api/data-contracts';
import { updateGuestOrderAddressMutation, useGetGuestOrderAddressQuery } from '@/hooks/use-guest';
import Loading from '../common/loading';

type Props = {
  children: React.ReactNode;
  no: number;
  guest?: boolean;
};

export default function OrderAddressModifyDialog({ children, no, guest }: Props) {
  const [open, setOpen] = useState(false);
  const updateGuestOrderAddress = updateGuestOrderAddressMutation(); // 비회원 배송주소 수정
  const updateOrderAddressMutation = useUpdateOrderAddressMutation(); // 고객 배송주소 수정

  const guestQuery = useGetGuestOrderAddressQuery(no, open && !!guest); // 비회원 배송주소 조회
  const customerQuery = useGetOrderAddressQuery(no, open && !guest); // 고객 배송주소 조회

  const isLoading = guest ? guestQuery.isLoading : customerQuery.isLoading;
  const data = (guest ? guestQuery.data : customerQuery.data) as OrdersAddressListData | undefined;

  /** 배송지 수정  */
  const updateOrderAddress = async (body: addresssDailogForm) => {
    try {
      if (!no) return;

      // 비회원은 비회원 update mutation을 이용
      if (guest) {
        await updateGuestOrderAddress.mutateAsync({ no, data: body });
        toast.success('배송지가 수정되었습니다.');
        setOpen(false);
        return;
      }

      await updateOrderAddressMutation.mutateAsync({ no, data: body });
      toast.success('배송지가 수정되었습니다.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <Loading title="배송지 수정" />;

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
          currentValues={{ ...(data as OrdersAddressListData), isDefault: false, no }}
          onSubmit={updateOrderAddress}
          isLoading={updateOrderAddressMutation.isPending}
          isHidden={true}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
