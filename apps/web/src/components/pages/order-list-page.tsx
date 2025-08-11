import { Button, Card, CardContent } from '@appabbang/ui';
import { orders } from '../mypage/meta-data';
import clsx from 'clsx';
import { useNavigate } from '@tanstack/react-router';
import OrderItem from '../mypage/order-item';

// Custom CSS
const btnCssStr = `w-30 bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function OrderListPage() {
  const navigate = useNavigate();

  // 주문상세내역
  const showDetail = (no: number) => {
    navigate({ to: `/mypage/order-list/${no}` });
  };

  // 배송(수령)현황
  const deliveryDetail = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center mb-30">
      <p className="w-2/3 mt-10">* 최근 1년 이내 주문건만 확인됩니다.</p>
      {orders.map((data, i) => (
        <Card key={i} className="mt-2 mb-5 flex flex-col w-2/3">
          <CardContent className="mt-2 flex gap-3">
            <div className="font-bold">
              {new Date(data.createdAt).toISOString().split('T')[0]} 주문
            </div>
            <div>{data.orderNumber}</div>
            <div className="text-blue-600 font-bold">
              [{data.orderStatus === '10' ? '입금대기' : data.orderStatus === '30' ? '배송중' : ''}]
            </div>
          </CardContent>

          <CardContent>
            <div className="flex flex-row gap-2 justify-between w-full">
              {/* 아이템 목록 */}
              <div className="flex flex-col gap-1 w-2/3">
                {data.orderItem.map((item, i) => (
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
                  <Button className={clsx(btnCssStr)}>주문취소</Button>
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
