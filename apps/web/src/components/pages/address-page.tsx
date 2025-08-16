import { useQuery } from '@tanstack/react-query';
import type { AddressListData as AddressListDataOrigin } from '@/api/data-contracts';
import AddressCreateDialog from '@/components/mypage/address-create-dialog';
import AddressModifyDialog from '../mypage/address-modify-dialog';
import { Badge, Skeleton } from '@appabbang/ui';
import { getFormattedMobile } from '@/utils';
import { MyService } from '@/services/api/my-service';

export default function AddressPage() {
  const { getAddressList } = MyService;
  const { data, isLoading } = useQuery({
    queryKey: ['getAddresses'],
    queryFn: getAddressList,
  });

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

const AddressList = ({ data }: { data: AddressListData | undefined }) => {
  return (
    <>
      {data?.map((item) => (
        <AddressModifyDialog key={item.no} data={item}>
          <div className="border-b p-2 cursor-pointer flex flex-col gap-2 hover:bg-muted">
            <div className="flex items-center gap-4">
              <p className="font-bold">{item.recipientName}</p>

              {item.isDefault && <Badge variant="secondary">기본배송지</Badge>}
            </div>
            <p>
              {item.address},&nbsp;{item.addressDetail}({item.zipcode})
            </p>
            <p className="text-sm">{getFormattedMobile(item.recipientMobile ?? '')}</p>
          </div>
        </AddressModifyDialog>
      ))}
    </>
  );
};

export type AddressListData = (Partial<AddressListDataOrigin[number]> & { isDefault: boolean })[];
// const testData: AddressListData = [
//   {
//     no: 1,
//     address: '서울특별시 강남구 역삼동 123-123',
//     addressDetail: '101동 101호',
//     zipcode: '12345',
//     message: '배송 전 연락 주세요',
//     recipientName: '김가나',
//     recipientMobile: '010-3020-1010',
//     isDefault: true,
//   },
//   {ㅇ
//     no: 2,
//     address: '서울특별시 강남구 역삼동 123-123',
//     addressDetail: '101동 101호',
//     zipcode: '12345',
//     message: '배송 전 연락 주세요',
//     recipientName: '김가나',
//     recipientMobile: '010-3020-1010',
//     isDefault: false,
//   },
//   {
//     no: 3,
//     address: '서울특별시 강남구 역삼동 123-123',
//     addressDetail: '101동 101호',
//     zipcode: '12345',
//     message: '배송 전 연락 주세요',
//     recipientName: '김가나',
//     recipientMobile: '01030201010',
//     isDefault: false,
//   },
// ];
