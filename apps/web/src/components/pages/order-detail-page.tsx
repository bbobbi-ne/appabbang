/**
 * 마이페이지 - 주문내역에서 [주문상세보기] 클릭시 들어오는 주문상세내역 페이지.
 */

import { Button, Card, CardContent } from '@appabbang/ui';
import { useEffect, useState } from 'react';
import OrderItem from '../mypage/order-item';
import { ArrowRight } from 'lucide-react';
import AddressModifyDialog from '../mypage/address-modify-dialog';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { MyService } from '@/services/api/my-service';

type OrderItemsType = {
  no: number;
  breadNo: number;
  breadImageUrl: string;
  allergyInfo: string;
  breadName: string;
  countryOfOrigin: string;
  quantity: number;

  totalPrice: number;
  unitPrice: number;

  createdAt: string;
  updatedAt: string;

  orderNo: number;
  order: {
    no: number;

    address: string;
    addressDetail: string;
    zipcode: string;

    deliveryMethodFee: number;
    deliveryMethodName: string;
    discountAmount: number;
    totalPrice: number;
    trackingNumber: string;
    message: string;
    orderStatus: string;

    isPaymentRefundTermsAgreed: boolean;
    isPrivacyTermsAgreed: boolean;
    isServiceTermsAgreed: boolean;
    memo: string;
    orderNumber: string;
    orderPw: string;

    ordererName: string;
    ordererMobile: string;
    recipientMobile: string;
    recipientName: string;

    customerNo: number;
    couponNo: number;
    orderRoundNo: number;

    createdAt: string;
    updatedAt: string;
  };
};

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
  const [address, setAddress] = useState<IAddressProps>();
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();
  const { getOrder, getOrderStatus } = MyService;

  const { isLoading, data: order } = useQuery({
    queryKey: ['getOrder'],
    queryFn: () => getOrder(Number(orderNo)),
    enabled: !!orderNo,
  });

  const { isLoading: orderStatusLoading, data: orderStatus } = useQuery({
    queryKey: ['getOrderStatus'],
    queryFn: () => getOrderStatus(),
  });

  /** 상품금액 계산 */
  useEffect(() => {
    if (order) {
      let unitPrice = 0;
      order.orderItems.map((item: OrderItemsType) => {
        unitPrice += item.unitPrice;
      });

      setAmount(unitPrice);
    }
  }, [order]);

  /** 주소 설정 */
  useEffect(() => {
    if (order) {
      const address = {
        no: 1,
        address: order.address,
        addressDetail: order.addressDetail,
        zipcode: order.zipcode,
        message: order.message,
        recipientName: order.recipientName,
        recipientMobile: order.recipientMobile,
        isDefault: true,
      };

      setAddress(address);
    }
  }, [order]);

  // 배송현황 이동
  const onDeliveryMove = (no: number) => navigate({ to: `/mypage/order-delivery/${no}` });

  if (isLoading || orderStatusLoading) return <div>주문정보를 조회중입니다...</div>;
  else
    return (
      <div className="w-full flex flex-col justify-center items-center mt-10 mb-30">
        <Card className="mt-2 mb-5 flex flex-col w-2/3">
          <CardContent className="mt-4 flex gap-3">
            <div className="font-bold">
              {new Date(order.createdAt).toISOString().split('T')[0]} 주문
            </div>
            <div>{order.orderNumber}</div>
            <div className="text-blue-600 font-bold">
              [
              {orderStatus.map((status: { code: string; name: string }) => {
                return status.code === order.orderStatus && status.name;
              })}
              ]
            </div>
          </CardContent>

          <CardContent>
            <div className="font-bold text-2xl mt-2 mb-4">결제정보</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between">
                <div>상품금액</div>
                <div>{amount.toLocaleString()}원</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>배송비</div>
                <div>{order.deliveryMethodFee.toLocaleString()}원</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>최종결제금액</div>
                <div>{order.totalPrice.toLocaleString()}원</div>
              </div>
            </div>

            <div className="border mt-5 mb-5"></div>

            <div className="font-bold text-2xl mt-2 mb-4">주문상품 내역</div>
            {order.orderItems.map((item: OrderItemsType, i: number) => (
              <OrderItem key={i} item={item} />
            ))}

            <div className="border mt-5 mb-5"></div>

            <div className="mt-2 mb-4 flex flex-col">
              <div className="flex flex-row mb-5">
                <div className="font-bold text-2xl mr-5">배송정보</div>
                {order.orderStatus == '30' ? (
                  <div
                    className="text-[14px] text-gray-500 flex flex-row items-center cursor-pointer"
                    onClick={() => onDeliveryMove(order.no)}
                  >
                    수령현황 보기
                    <ArrowRight />
                  </div>
                ) : null}
              </div>

              <div>
                <div>{order.recipientName}</div>
                <div className="flex gap-2 items-center">
                  {order.address} {order.addressDetail}{' '}
                  <AddressModifyDialog data={address} ORDER_DETAIL={true}>
                    <Button className="text-[12px] h-5">배송지 변경</Button>
                  </AddressModifyDialog>
                </div>
                <div>{order.recipientMobile}</div>
                <div className="mt-3 text-gray-400">{order.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

export default OrderDetailPage;
