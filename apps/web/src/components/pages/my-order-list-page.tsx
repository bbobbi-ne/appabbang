import { Badge, Button, Card, CardContent } from '@appabbang/ui';
import { useNavigate } from '@tanstack/react-router';
import OrderItem from '@/components/mypage/order-item';
import OrderCalcenDialog from '@/components/mypage/order-cancel-dialog';
import Loading from '@/components/common/loading';
import { useGetOrdersQuery } from '@/hooks/use-my';

const CANCEL_ORDER_STATUS = ['50', '51', '52'];
const AVALIABLE_DELIVERY_ORDER_STATUS = ['11', '20', '30', '31', '40'];

export default function MyOrderListPage() {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useGetOrdersQuery();

  // 주문상세내역
  const moveToOrderDetail = (no: number) => {
    navigate({ to: `/mypage/order-list/${no}` });
  };

  // 배송(수령)현황
  const moveToDeliveryDetail = (orderNo: number) => {
    navigate({ to: `/mypage/order-list/${orderNo}/delivery` });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <p className="py-2 text-xs">* 최근 1년 이내 주문건만 확인됩니다.</p>

      <div className="space-y-2">
        {orders?.map((order, i: number) => (
          <Card key={i}>
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
                    <b>{new Date(order.createdAt).toISOString().split('T')[0]} 주문</b>
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
                  <OrderCalcenDialog no={order.no}>
                    <Button variant="outline">주문취소</Button>
                  </OrderCalcenDialog>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}

        {orders?.length === 0 && (
          <div className="p-8 bg-primary-foreground">등록된 주문이 없어요 🥲</div>
        )}
      </div>
    </div>
  );
}
