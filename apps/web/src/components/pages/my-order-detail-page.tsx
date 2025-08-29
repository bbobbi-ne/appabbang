/**
 * 마이페이지 - 주문내역에서 [주문상세보기] 클릭시 들어오는 주문상세내역 페이지.
 */

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Badge, Button, Card, CardContent } from '@appabbang/ui';
import { formatMobile } from '@appabbang/utils';
import { useGetOrderQuery } from '@/hooks/use-my';
import OrderItem from '@/components/mypage/order-item';
import OrderAddressModifyDialog from '@/components/mypage/order-address-modify-dialog';

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

const CANCEL_ORDER_STATUS = ['50', '51', '52'];
const AVALIABLE_DELIVERY_ORDER_STATUS = ['11', '20', '30', '31', '40'];

export default function MyOrderDetailPage({ orderNo }: { orderNo: number }) {
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderQuery(orderNo);

  /** 상품금액 계산 */
  useEffect(() => {
    if (order) {
      let unitPrice = 0;
      order?.orderItems?.map((item: OrderItemsType) => {
        unitPrice += item.totalPrice;
      });

      setAmount(unitPrice);
    }
  }, [order]);

  // 배송현황 이동
  const onDeliveryMove = (no: number) => navigate({ to: `/mypage/order-list/${no}/delivery` });

  if (isLoading) return <div>주문정보를 조회중입니다...</div>;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-row justify-between">
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="space-x-2">
                <Badge variant="outline">{order.orderNumber}</Badge>
                {CANCEL_ORDER_STATUS.includes(order.orderStatus) ? (
                  <Badge variant="destructive">{order.orderStatusName}</Badge>
                ) : (
                  <Badge variant="secondary">{order.orderStatusName}</Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold">
                {new Date(order.createdAt).toISOString().split('T')[0]} 주문
              </h3>
            </div>
          </div>

          {!CANCEL_ORDER_STATUS.includes(order.orderStatus) &&
            AVALIABLE_DELIVERY_ORDER_STATUS.includes(order.orderStatus) && (
              <Button variant="outline" onClick={() => onDeliveryMove(order.no)}>
                배송(수령)현황 보기 <ArrowRight className="w-4 h-4" />
              </Button>
            )}
        </div>

        <div>
          <h3 className="text-xl font-semibold pt-2 pb-4">결제정보</h3>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <div>상품금액</div>
              <div>{amount.toLocaleString()}원</div>
            </div>

            {!!order.deliveryMethodFee && (
              <div className="flex flex-row justify-between">
                <div>배송비</div>
                <div>{order.deliveryMethodFee.toLocaleString()}원</div>
              </div>
            )}

            {!!order.discountAmount && (
              <div className="flex flex-row justify-between">
                <div>할인금액</div>
                <div>{order.discountAmount.toLocaleString()}원</div>
              </div>
            )}

            <div className="flex flex-row justify-between border-t pt-2">
              <div className="font-semibold">최종결제금액</div>
              <div className="font-semibold">{order.totalPrice.toLocaleString()}원</div>
            </div>
          </div>
        </div>

        <div className="pt-4" />

        <div>
          <h3 className="font-semibold text-xl pt-2 pb-4">주문상품 내역</h3>
          <div className="space-y-2">
            {order.orderItems.map((item: OrderItemsType, i: number) => (
              <OrderItem key={i} item={item} />
            ))}
          </div>
        </div>

        <div className="pt-4" />

        {order.deliveryTypeCode !== '20' ? (
          <div>
            <h3 className="font-semibold text-xl pt-2 pb-4">배송정보</h3>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="min-w-28">수령인</span>
                  <p>{order.recipientName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="min-w-28">주소</span>
                  <p>
                    {order.address},&nbsp;{order.addressDetail} ({order.zipcode})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="min-w-28">수령인 전화번호</span>
                  <p className="text-sm">{formatMobile(order.recipientMobile ?? '')}</p>
                </div>
              </div>

              <div className="pt-2 md:pt-0 ml-auto md:ml-0">
                {(order.orderStatus === '10' || order.orderStatus === '11') && (
                  <OrderAddressModifyDialog no={order.no}>
                    <Button>배송지 수정</Button>
                  </OrderAddressModifyDialog>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-xl pt-2 pb-4">직접수령 정보</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="min-w-28">주문인</span>
                  <p>{order.ordererName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="min-w-28">주문인 전화번호</span>
                  <p className="text-sm">{getFormattedMobile(order.ordererMobile ?? '')}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
