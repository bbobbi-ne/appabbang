/**
 * 배송현황 페이지
 */

import { Badge, Button, Card, CardContent, cn } from '@appabbang/ui';
import { useEffect, useMemo } from 'react';
import OrderItem from '@/components/mypage/order-item';

import { ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetOrderDeliveryQuery } from '@/hooks/use-my';
import { formatMobile } from '@appabbang/utils';

// interface IDataProps {
//   no: number;
//   orderNumber: string;
//   orderStatus: string;
//   totalPrice: number;
//   deliveryMethodFee: number;
//   recipientName: string;
//   recipientMobile: string;
//   address: string;
//   addressDetail: string;
//   zipcode: string;
//   message: string;
//   orderItem: IOrderItem[];
//   createdAt: string;
//   deliveryMethodName: string;
//   trackingNumber: string;
// }

const CANCEL_ORDER_STATUS = ['50', '51', '52'];
const AVALIABLE_DELIVERY_ORDER_STATUS = ['11', '20', '30', '31', '40'];

export default function MyOrderDeliveryPage({ orderNo }: { orderNo: number }) {
  const navigate = useNavigate();

  const { data: order, isLoading } = useGetOrderDeliveryQuery(orderNo);

  const steps = [
    { code: '11', label: '접수완료' },
    { code: '20', label: '제조중' },
    { code: '30', label: '배송중 ' },
    { code: '31', label: '수령대기중' },
    { code: '40', label: '완료' },
  ];

  const filteredSteps = useMemo(() => {
    if (!order) return [];

    // 배송방법이 직접수령인 경우 배송중 단계 제외
    if (order.deliveryTypeCode === '20') {
      return steps.filter((step) => step.code !== '30');
    } else {
      return steps.filter((step) => step.code !== '31');
    }
  }, [order]);

  const moveToOrderDetail = (no: number) => navigate({ to: `/mypage/order-list/${no}` });

  useEffect(() => {
    if (order) {
      if (!AVALIABLE_DELIVERY_ORDER_STATUS.includes(order.orderStatus)) {
        navigate({ to: `/mypage/order-list/${order.no}` });
      }
    }
  }, [order]);

  if (isLoading || !order) return <div>데이터 로딩중입니다...</div>;

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
          <Button
            variant="outline"
            onClick={() => moveToOrderDetail(order.no)}
            className="hidden sm:inline-flex"
          >
            주문내역보기
            <ArrowRight />
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-semibold pt-2 pb-4">배송(수령)현황</h3>

          {/* STEPS */}
          <div className="flex flex-row pb-8">
            {filteredSteps.map((step, idx) => {
              if (isNaN(order.orderStatus))
                return <div key={`dummy-${idx}`}>데이터 로딩중입니다...</div>;

              const orderStatus = Number(order.orderStatus);
              const stepCode = Number(step.code);

              const isCompleted = stepCode < orderStatus || orderStatus === 40;
              const isCurrent = stepCode === orderStatus && orderStatus !== 40;

              return (
                <div className="w-1/4" key={step.code}>
                  <div
                    className={cn(
                      'h-2 border',
                      isCompleted && 'bg-[#FF9E42] border-[#FF9E42]',
                      isCurrent && 'bg-[#FFE6C0] border-[#FFE6C0]',
                    )}
                  />
                  <div className="text-center text-sm">{step.label}</div>
                </div>
              );
            })}
          </div>

          {/* 배송 정보 */}
          <div className="space-y-2">
            <div className="flex flex-row items-center gap-4">
              <span className="min-w-28">배송방법</span>
              <p>{order.deliveryMethodName}</p>
            </div>
            {order.trackingNumber && (
              <div className="flex flex-row items-center gap-4">
                <span className="min-w-28">송장번호</span>
                <p>{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4" />

        <div>
          <h3 className="font-semibold text-xl pt-2 pb-4">배송정보</h3>

          <div className="space-y-2">
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
        </div>

        <div className="pt-4" />

        <div>
          <h3 className="text-xl font-semibold pt-2 pb-4">주문상품 내역</h3>
          <div className="space-y-2">
            {order.orderItems.map((item: any, i: number) => (
              <OrderItem key={`delivery-${i}`} item={item} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
