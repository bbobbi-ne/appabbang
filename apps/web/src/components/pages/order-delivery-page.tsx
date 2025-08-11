/**
 * 배송현황 페이지
 */

import { Card, CardContent } from '@appabbang/ui';
import { useEffect, useState } from 'react';
import type { IOrderItem } from '../mypage/order-item';
import { orders } from '../mypage/meta-data';
import OrderItem from '../mypage/order-item';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

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
  deliveryMethodName: string;
  trackingNumber: string;
}

function OrderDeliveryPage({ orderNo }: { orderNo: number }) {
  const [data, setData] = useState<IDataProps | null>(null);
  const navigate = useNavigate();

  const steps = [
    { code: '11', label: '접수완료' },
    { code: '20', label: '제조중' },
    { code: '30', label: '배송중 / 수령대기중' },
    { code: '40', label: '완료' },
  ];

  useEffect(() => {
    const result = orders.find((data) => data.no === orderNo) || null;
    // 데이터 설정
    setData(result);
  }, [orderNo]);

  if (!data) return <div>데이터 로딩중입니다...</div>;

  const currentIndex = steps.findIndex((step) => step.code === data.orderStatus);

  const onDetailMove = (no: number) => navigate({ to: `/mypage/order-list/${no}` });

  return (
    <div className="w-full flex flex-col justify-center items-center mt-10 mb-30">
      <Card className="mt-2 mb-5 flex flex-col w-2/3">
        <CardContent className="mt-4 flex gap-3">
          <div className="font-bold">
            {new Date(data.createdAt).toISOString().split('T')[0]} 주문
          </div>
          <div>{data.orderNumber}</div>
          <div className="text-blue-600 font-bold">
            [{data.orderStatus === '10' ? '입금대기' : data.orderStatus === '30' ? '배송중' : ''}]
          </div>
          <div>
            <div
              className="text-[14px] text-gray-500 flex flex-row items-center cursor-pointer"
              onClick={() => onDetailMove(data.no)}
            >
              주문상태 보기
              <ArrowRight />
            </div>
          </div>
        </CardContent>

        <CardContent>
          <div className="font-bold text-2xl mt-2 mb-4">배송(수령)현황</div>
          <div className="flex flex-row mt-2 mb-5">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div className="w-1/4" key={step.code}>
                  <div
                    className={clsx(
                      'h-2 border',
                      isCompleted && 'bg-[#FF9E42] border-[#FF9E42]',
                      isCurrent && 'bg-[#FFE6C0] border-[#FFE6C0]',
                    )}
                  />
                  <div className="text-center text-[14px] text-gray-600">{step.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <div>배송방법</div>
              <div>택배</div>
            </div>
            <div className="flex flex-row justify-between">
              <div>택배사</div>
              <div>{data.deliveryMethodName}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div>송장번호</div>
              <div>{data.trackingNumber}</div>
            </div>
          </div>

          <div className="border mt-5 mb-5"></div>

          <div className="font-bold text-2xl mt-2 mb-4">주문상품 내역</div>
          {data.orderItem.map((item, i) => (
            <OrderItem key={i} item={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderDeliveryPage;
