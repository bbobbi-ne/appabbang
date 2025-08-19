import { Button, Card, CardContent } from '@appabbang/ui';
import clsx from 'clsx';
import { useNavigate } from '@tanstack/react-router';
import OrderItem from '../mypage/order-item';
import OrderCalcenDialog from '../mypage/order-cancel-dialog';
import { useQuery } from '@tanstack/react-query';
import { MyService } from '@/services/api/my-service';
import { useAccessTokenStore } from '@/store/session';
import Loading from '../common/loading';

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
};

type OrdersType = {
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
  orderItems: OrderItemsType[];
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

// Custom CSS
const btnCssStr = `w-30 bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function OrderListPage() {
  const navigate = useNavigate();
  const { getOrders, getOrderStatus } = MyService;
  const { accessToken } = useAccessTokenStore();

  const { isLoading, data: orders } = useQuery({
    queryKey: ['getOrders'],
    queryFn: () => getOrders(),
    enabled: !!accessToken,
  });

  const { isLoading: orderStatusLoading, data: orderStatus } = useQuery({
    queryKey: ['getOrderStatus'],
    queryFn: () => getOrderStatus(),
  });

  // 주문상세내역
  const showDetail = (no: number) => {
    navigate({ to: `/mypage/order-list/${no}` });
  };

  // 배송(수령)현황
  const deliveryDetail = () => {
    navigate({ to: '/' });
  };

  if (isLoading || orderStatusLoading) return <Loading />;
  return (
    <div className="w-full flex flex-col justify-center items-center mb-30">
      <p className="w-2/3 mt-10">* 최근 1년 이내 주문건만 확인됩니다.</p>
      {orders.map((data: OrdersType, i: number) => (
        <Card key={i} className="mt-2 mb-5 flex flex-col w-2/3">
          <CardContent className="mt-2 flex gap-3">
            <div className="font-bold">
              {new Date(data.createdAt).toISOString().split('T')[0]} 주문
            </div>
            <div>{data.orderNumber}</div>
            <div className="text-blue-600 font-bold">
              [
              {orderStatus.map((status: { code: string; name: string }) => {
                return status.code === data.orderStatus && status.name;
              })}
              ]
            </div>
          </CardContent>

          <CardContent>
            <div className="flex flex-row gap-2 justify-between w-full">
              {/* 아이템 목록 */}
              <div className="flex flex-col gap-1 w-2/3">
                {data.orderItems.map((item, i) => (
                  <OrderItem key={i} item={item} />
                ))}
              </div>

              {/* 버튼 영역 */}
              <div className="flex flex-col justify-center gap-2 ml-[45%]">
                <Button className={clsx(btnCssStr)} onClick={() => showDetail(data.no)}>
                  주문상세보기
                </Button>
                <Button className={clsx(btnCssStr)} onClick={deliveryDetail}>
                  배송(수령)현황
                </Button>
                {Number(data.orderStatus) < 30 ? (
                  <OrderCalcenDialog>
                    <Button className={clsx(btnCssStr)}>주문취소</Button>
                  </OrderCalcenDialog>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrderListPage;
