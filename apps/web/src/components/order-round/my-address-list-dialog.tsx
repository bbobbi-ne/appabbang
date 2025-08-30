import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@appabbang/ui';
import { useGetAddressListQuery } from '@/hooks/use-my';
import { MyAddressList } from '@/components/order-round/my-address-list';

/** 회원의 배송지 목록 조회 */
export const MyAddressListDialog = ({
  children,
  handleSelectAddress,
}: {
  children: React.ReactNode;
  handleSelectAddress: (item: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: addressList } = useGetAddressListQuery();

  const selectAddress = (item: any) => {
    handleSelectAddress(item);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="overflow-y-auto max-h-11/12"
        >
          <DialogHeader>
            <DialogTitle className="text-left">나의 배송지</DialogTitle>
          </DialogHeader>
          <DialogDescription className="hidden" />

          <MyAddressList addressList={addressList} selectAddress={selectAddress} />
        </DialogContent>
      </Dialog>
    </>
  );
};
