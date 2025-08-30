import { useState } from 'react';
import { Badge, Button, toast } from '@appabbang/ui';
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/hooks/use-my';
import { formatMobile } from '@appabbang/utils';
import AddressForm from '@/components/mypage/address-form';

/** 회원의 배송지 목록 조회 */
export const MyAddressList = ({
  addressList,
  selectAddress,
}: {
  addressList: any;
  selectAddress: (item: any) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentValues, setCurrentValues] = useState<any>(null);
  const createAddressMutation = useCreateAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const openEdit = (item?: any) => {
    setCurrentValues(item);
    setIsClicked(true);
  };

  const closeEdit = () => {
    setIsClicked(false);
    setCurrentValues(null);
  };

  const createAddress = async (data: any) => {
    try {
      await createAddressMutation.mutateAsync(data);
      toast.success('배송지 등록 완료');
      closeEdit();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateAddress = async (data: any) => {
    try {
      await updateAddressMutation.mutateAsync({ no: currentValues.no, data });
      toast.success('배송지 수정 완료');
      closeEdit();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteAddress = async (no: number) => {
    try {
      await deleteAddressMutation.mutateAsync(no);
      toast.success('배송지 삭제 완료');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {!isClicked && !currentValues && (
        <Button size="sm" className="mb-2" onClick={() => openEdit()}>
          배송지 추가하기
        </Button>
      )}
      {isClicked ? (
        <div>
          <AddressForm
            onSubmit={!currentValues ? createAddress : updateAddress}
            isLoading={
              !currentValues ? createAddressMutation.isPending : updateAddressMutation.isPending
            }
            currentValues={currentValues}
            onCancel={closeEdit}
            {...(currentValues && {
              deleteAddress,
              deleteLoading: deleteAddressMutation.isPending,
            })}
          />
        </div>
      ) : (
        addressList?.map((item: any) => (
          <div
            key={`address-${item.no}`}
            className="border-b p-2 cursor-pointer flex flex-col gap-2 hover:bg-muted"
            onClick={() => {
              selectAddress(item);
            }}
          >
            <div className="flex items-center gap-4">
              <p className="font-bold">{item.recipientName}</p>

              {item.isDefault && <Badge variant="secondary">기본배송지</Badge>}
            </div>
            <p>
              {item.address},&nbsp;{item.addressDetail}({item.zipcode})
            </p>
            <p className="text-sm">{formatMobile(item.recipientMobile ?? '')}</p>

            <p className="text-sm text-muted-foreground">배송메세지: {item.message}</p>
            <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="w-fit">
              수정하기
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
