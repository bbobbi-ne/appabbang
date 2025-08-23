import { Button, Card, CardContent } from '@appabbang/ui';
import { useNavigate } from '@tanstack/react-router';
import OrderItem from '@/components/mypage/order-item';
import OrderCalcenDialog from '@/components/mypage/order-cancel-dialog';
import Loading from '@/components/common/loading';
import { useGetOrdersQuery } from '@/hooks/use-my';
import OrderAddressModifyDialog from '@/components/mypage/order-address-modify-dialog';

export default function OrderListPage() {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useGetOrdersQuery();

  // 주문상세내역
  const moveToOrderDetail = (no: number) => {
    navigate({ to: `/mypage/order-list/${no}` });
  };

  // 배송(수령)현황
  const moveToDeliveryDetail = () => {
    navigate({ to: '/' });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <p>* 최근 1년 이내 주문건만 확인됩니다.</p>
      {orders?.map((order, i: number) => (
        <Card key={i}>
          <CardContent className="pt-6 flex justify-between">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span>{new Date(order.createdAt).toISOString().split('T')[0]} 주문</span>
                <span>{order.orderNumber}</span>
                <span className="text-blue-600 font-bold">{order.orderStatusName}</span>
              </div>

              <div className="flex flex-col gap-2">
                {order.orderItems.map((item, i) => (
                  <OrderItem key={i} item={item} />
                ))}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col justify-center gap-2">
              <Button variant="outline" onClick={() => moveToOrderDetail(order.no)}>
                주문상세보기
              </Button>
              <Button variant="outline" onClick={moveToDeliveryDetail}>
                배송(수령)현황
              </Button>
              {Number(order.orderStatus) < 20 ? (
                <OrderCalcenDialog>
                  <Button variant="outline">주문취소</Button>
                </OrderCalcenDialog>
              ) : null}

              {(order.orderStatus === '10' || order.orderStatus === '11') && (
                <OrderAddressModifyDialog no={order.no}>
                  <Button variant="outline">배송지 수정</Button>
                </OrderAddressModifyDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
