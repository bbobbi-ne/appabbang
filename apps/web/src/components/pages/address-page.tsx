import { Badge } from '@appabbang/ui';
import AddressCreateDialog from '@/components/mypage/address-create-dialog';

export default function AddressPage() {
  const data = testData;

  return (
    <>
      <div className="flex justify-end mb-2">
        <AddressCreateDialog />
      </div>

      {data.map((item) => (
        <div
          key={item.no}
          className="border-b p-2 cursor-pointer flex flex-col gap-2 hover:bg-muted"
        >
          <div className="flex items-center gap-4">
            <p className="font-bold">{item.recipientName}</p>

            {item.isDefault && <Badge variant="secondary">기본배송지</Badge>}
          </div>
          <p>
            {item.address},&nbsp;{item.addressDetail}({item.zipCode})
          </p>
          <p className="text-sm">{item.recipientMobile}</p>
        </div>
      ))}

      <div className="pb-20" />
    </>
  );
}

const testData = [
  {
    no: 1,
    address: '서울특별시 강남구 역삼동 123-123',
    addressDetail: '101동 101호',
    zipCode: '12345',
    message: '배송 전 연락 주세요',
    recipientName: '김가나',
    recipientMobile: '010-3020-1010',
    isDefault: true,
  },
  {
    no: 2,
    address: '서울특별시 강남구 역삼동 123-123',
    addressDetail: '101동 101호',
    zipCode: '12345',
    message: '배송 전 연락 주세요',
    recipientName: '김가나',
    recipientMobile: '010-3020-1010',
    isDefault: false,
  },
  {
    no: 3,
    address: '서울특별시 강남구 역삼동 123-123',
    addressDetail: '101동 101호',
    zipCode: '12345',
    message: '배송 전 연락 주세요',
    recipientName: '김가나',
    recipientMobile: '010-3020-1010',
    isDefault: false,
  },
];
