import { Button, Card, CardContent } from '@appabbang/ui';
import { orders } from '../mypage/meta-data';
import clsx from 'clsx';

// Custom CSS
const btnCssStr = `w-30 bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function OrderListPage() {
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
              [{data.orderStatus === '10' && '입금대기'}]
            </div>
          </CardContent>

          <CardContent>
            <div className="flex flex-row gap-2 justify-between w-full">
              {/* 아이템 목록 */}
              <div className="flex flex-col gap-1 w-2/3">
                {data.orderItem.map((item, i) => (
                  <div key={i} className="flex flex-row gap-5">
                    <img className="w-20 h-20" src={item.breadImageUrl} alt="빵 이미지" />
                    <div className="mt-2">
                      <p>{item.breadName}</p>
                      <div className="flex gap-2">
                        <span>{item.unitPrice.toLocaleString()}원</span>
                        <span>{item.quantity}개</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 버튼 영역 */}
              <div className="flex flex-col justify-center gap-2 ml-[45%]">
                <Button className={clsx(btnCssStr)}>주문상세보기</Button>
                <Button className={clsx(btnCssStr)}>배송(수령)현황</Button>
                <Button className={clsx(btnCssStr)}>주문취소</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrderListPage;
