/** 비회원 주문목록 */

import type { GuestCreateData } from '@/api/data-contracts';
import { Badge, Button, Card, CardContent } from '@appabbang/ui';
import { formatDate } from '@appabbang/utils';
import OrderCalcenDialog from '../mypage/order-cancel-dialog';
import { useNavigate } from '@tanstack/react-router';
import OrderItem from '../mypage/order-item';

interface GuestOrdersProps {
  list: GuestCreateData;
}

const CANCEL_ORDER_STATUS = ['50', '51', '52'];
const AVALIABLE_DELIVERY_ORDER_STATUS = ['10', '11', '20', '30', '31', '40'];

export default function GuestOrders({ list }: GuestOrdersProps) {
  const navigate = useNavigate();

  // 주문상세내역
  const moveToOrderDetail = (no: number) => {
    navigate({ to: `/guest/order-list/${no}` });
  };

  // 배송(수령)현황
  const moveToDeliveryDetail = (no: number) => {
    navigate({ to: `/guest/order-list/${no}/delivery` });
  };

  return (
    <div className="mt-10">
      <p className="py-2 text-xs">* 최근 1년 이내 주문건만 확인됩니다.</p>

      <div className="space-y-2">
        {list.map((order) => (
          <Card key={order.no}>
            <CardContent className="pt-6 flex flex-col md:flex-row justify-between gap-2">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row-reverse md:items-center gap-2">
                  <div className="space-x-2">
                    <Badge variant="outline">{order.orderNumber}</Badge>
                    {CANCEL_ORDER_STATUS.includes(order.orderStatus) ? (
                      <Badge variant="destructive">{order.orderStatusName}</Badge>
                    ) : (
                      <Badge variant="secondary">{order.orderStatusName}</Badge>
                    )}
                  </div>
                  <h3>
                    <b>{formatDate(new Date(order.createdAt))} 주문</b>
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {order.orderItems.map((item, i) => (
                    <OrderItem key={i} item={item} />
                  ))}
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex flex-row justify-end md:flex-col md:justify-center gap-2">
                <Button variant="outline" onClick={() => moveToOrderDetail(order.no)}>
                  주문상세보기
                </Button>
                {!CANCEL_ORDER_STATUS.includes(order.orderStatus) &&
                  AVALIABLE_DELIVERY_ORDER_STATUS.includes(order.orderStatus) && (
                    <Button variant="outline" onClick={() => moveToDeliveryDetail(order.no)}>
                      배송(수령)현황
                    </Button>
                  )}
                {Number(order.orderStatus) < 20 ? (
                  <OrderCalcenDialog no={order.no} orderRoundNo={order.orderRoundNo}>
                    <Button variant="outline">주문취소</Button>
                  </OrderCalcenDialog>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
