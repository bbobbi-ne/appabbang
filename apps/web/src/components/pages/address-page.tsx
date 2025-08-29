import type { AddressesListData } from '@/api/data-contracts';
import AddressCreateDialog from '@/components/mypage/address-create-dialog';
import AddressModifyDialog from '../mypage/address-modify-dialog';
import { Badge, Skeleton } from '@appabbang/ui';
import {
  useDeleteAddressMutation,
  useGetAddressListQuery,
  useUpdateAddressMutation,
} from '@/hooks/use-my';
import { formatMobile } from '@appabbang/utils';

export default function AddressPage() {
  const { data, isLoading } = useGetAddressListQuery();

  return (
    <>
      {/* 추가 버튼  */}
      <div className="flex justify-end mb-2">
        <AddressCreateDialog />
      </div>

      {/* 목록 리스트  */}
      {isLoading ? (
        <div className="pt-2 space-y-3">
          <Skeleton className="w-full h-4 rounded-xl" />
          <Skeleton className="w-full h-4 rounded-xl" />
          <Skeleton className="w-full h-4 rounded-xl" />
          <Skeleton className="w-full h-4 rounded-xl" />
        </div>
      ) : (
        <>
          {data?.length === 0 ? (
            <div className="p-8 bg-primary-foreground">
              등록된 배송지가 없어요 🥲 수령하실 배송지를 추가해주세요.
            </div>
          ) : (
            <AddressList data={data} />
          )}
        </>
      )}

      <div className="pb-20" />
    </>
  );
}

const AddressList = ({ data }: { data: AddressesListData | undefined }) => {
  const updateMutation = useUpdateAddressMutation();
  const deleteMutation = useDeleteAddressMutation();

  return (
    <>
      {data?.map((item) => (
        <AddressModifyDialog
          key={item.no}
          data={item}
          update={{
            mutateAsync: updateMutation.mutateAsync,
            isPending: updateMutation.isPending,
          }}
          remove={{
            mutateAsync: deleteMutation.mutateAsync,
            isPending: deleteMutation.isPending,
          }}
        >
          <div className="border-b p-2 cursor-pointer flex flex-col gap-2 hover:bg-muted">
            <div className="flex items-center gap-4">
              <p className="font-bold">{item.recipientName}</p>

              {item.isDefault && <Badge variant="secondary">기본배송지</Badge>}
            </div>
            <p>
              {item.address},&nbsp;{item.addressDetail}({item.zipcode})
            </p>
            <p className="text-sm">{formatMobile(item.recipientMobile ?? '')}</p>
          </div>
        </AddressModifyDialog>
      ))}
    </>
  );
};
