/**
 * 마이페이지 - 주문내역에서 [주문상세보기] 클릭시 들어오는 주문상세내역 페이지.
 */

import { Button, Card, CardContent } from '@appabbang/ui';
import { orders } from '../mypage/meta-data';
import { useEffect, useState } from 'react';
import type { IOrderItem } from '../mypage/order-item';
import OrderItem from '../mypage/order-item';
import { ArrowRight } from 'lucide-react';
import AddressModifyDialog from '../mypage/address-modify-dialog';

interface IDataProps {
  no: number;
  orderNumber: string;
  orderStatus: string;
  totalPrice: number;
  deliveryMethodFee: number;
  recipientName: string;
  recipientMobile: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  message: string;
  orderItem: IOrderItem[];
  createdAt: string;
}

interface IAddressProps {
  no: number;
  address: string;
  addressDetail: string;
  zipcode: string;
  message: string;
  recipientName: string;
  recipientMobile: string;
  isDefault: boolean;
}

function OrderDetailPage({ orderNo }: { orderNo: number }) {
  const [data, setData] = useState<IDataProps | null>(null);
  const [address, setAddress] = useState<IAddressProps>();

  useEffect(() => {
    const result = orders.find((data) => data.no === orderNo) || null;
    setData(result);

    if (result) {
      const address = {
        no: 1,
        address: result.address,
        addressDetail: result.addressDetail,
        zipcode: result.zipcode,
        message: result.message,
        recipientName: result.recipientName,
        recipientMobile: result.recipientMobile,
        isDefault: true,
      };

      setAddress(address);
    }
  }, [orderNo]);

  if (!data) return <div>주문정보를 조회중입니다...</div>;
  else
    return (
      <div className="w-full flex flex-col justify-center items-center mb-30">
        <Card className="mt-2 mb-5 flex flex-col w-2/3">
          <CardContent className="mt-4 flex gap-3">
            <div className="font-bold">
              {new Date(data.createdAt).toISOString().split('T')[0]} 주문
            </div>
            <div>{data.orderNumber}</div>
            <div className="text-blue-600 font-bold">
              [{data.orderStatus === '10' ? '입금대기' : data.orderStatus === '30' ? '배송중' : ''}]
            </div>
          </CardContent>

          <CardContent>
            <div className="font-bold text-2xl mt-2 mb-4">결제정보</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between">
                <div>상품금액</div>
                <div>{data.totalPrice.toLocaleString()}원</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>배송비</div>
                <div>{data.deliveryMethodFee.toLocaleString()}원</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>최종결제금액</div>
                <div>{(data.totalPrice + data.deliveryMethodFee).toLocaleString()}원</div>
              </div>
            </div>

            <div className="border mt-5 mb-5"></div>

            <div className="font-bold text-2xl mt-2 mb-4">주문상품 내역</div>
            {data.orderItem.map((item, i) => (
              <OrderItem key={i} item={item} />
            ))}

            <div className="border mt-5 mb-5"></div>

            <div className="mt-2 mb-4 flex flex-col">
              <div className="flex flex-row mb-5">
                <div className="font-bold text-2xl mr-5">배송정보</div>
                {data.orderStatus == '30' ? (
                  <div className="text-[14px] text-gray-500 flex flex-row items-center cursor-pointer">
                    수령현황 보기
                    <ArrowRight />
                  </div>
                ) : null}
              </div>

              <div>
                <div>{data.recipientName}</div>
                <div className="flex gap-2 items-center">
                  {data.address} {data.addressDetail}{' '}
                  <AddressModifyDialog data={address}>
                    <Button className="text-[12px] h-5">배송지 변경</Button>
                  </AddressModifyDialog>
                </div>
                <div>{data.recipientMobile}</div>
                <div className="mt-3 text-gray-400">{data.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

export default OrderDetailPage;
