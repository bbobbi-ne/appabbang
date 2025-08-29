import { useEffect, useMemo, useState } from 'react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  toast,
} from '@appabbang/ui';
import OrderFormSkeleton from '@/components/order/order-form-skeleton';
import { useLoaderData, useParams } from '@tanstack/react-router';
import { useGetDeliveryMethodsQuery } from '@/hooks/use-common-code';
import { BreadItem } from '@/components/order-round/bread-item';
import { OrderForm } from '@/components/order-round/order-form';
import { formatIsoToDateTime } from '@appabbang/utils';
import { useCreateOrderMutation } from '@/hooks/use-orders';
import type { ActiveListData } from '@/api/data-contracts';

/** Main Function */
export default function OrderRoundDetailPage({ myContact }: { myContact: any }) {
  const orderRoundData = useLoaderData({ from: '/_sub-page/order-round/$orderRoundNo' });
  const { orderRoundNo } = useParams({ from: '/_sub-page/order-round/$orderRoundNo' });

  /** 배송방법 목록 API */
  const { data: deliveryData } = useGetDeliveryMethodsQuery();

  /** 쿠폰 목록 API */
  const couponData: any[] = [];

  /** 선택한 빵 목록 */
  const [selectedBreads, setSelectedBreads] = useState<
    { no: number; quantity: number; unitPrice: number }[]
  >([]);

  /** 선택한 배송방법 */
  const [selectedDelivery, setSelectedDelivery] = useState<ActiveListData[0]>();

  /** 선택한 쿠폰 (임시) */
  const [selectedCoupon, setSelectedCoupon] = useState<{
    no: number;
    name: string;
    discountAmount: number;
  }>();

  const totalQuantity = useMemo(() => {
    return selectedBreads.reduce((acc, item) => acc + item.quantity, 0);
  }, [selectedBreads]);

  const totalBreadPrice = useMemo(() => {
    return selectedBreads.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [selectedBreads]);

  const totalPrice = useMemo(() => {
    return totalBreadPrice - (selectedCoupon?.discountAmount ?? 0) + (selectedDelivery?.fee ?? 0);
  }, [totalBreadPrice, selectedCoupon, selectedDelivery]);

  const createMutation = useCreateOrderMutation();

  /** 선택한 빵 핸들링 함수 */
  const handleSelectedBread = (bread: any, quantity: number) => {
    if (quantity === 0) {
      setSelectedBreads((prev) => prev.filter((item) => item.no !== bread.no));
      return;
    }

    // 이미 존재하는 빵이면 개수 증가
    const existingBread = selectedBreads.find((item) => item.no === bread.no);
    if (existingBread) {
      setSelectedBreads((prev) =>
        prev.map((item) => (item.no === bread.no ? { ...item, quantity } : item)),
      );
      return;
    } else {
      // 존재하지 않는 빵이면 추가
      setSelectedBreads((prev) => [
        ...prev,
        { no: bread.no, quantity, unitPrice: bread.unitPrice },
      ]);
    }
  };

  const createOrder = async (data: any) => {
    if (totalQuantity < orderRoundData?.minOrderQty) {
      alert('최소 주문 수량을 확인해주세요.');
      return;
    }

    if (totalQuantity > orderRoundData?.maxOrderQty) {
      alert('최대 주문 수량을 초과하였습니다.');
      return;
    }

    if (!window.confirm('주문을 진행하시겠습니까?')) {
      return;
    }

    const body = {
      orderRoundNo,
      orderItems: selectedBreads.map((item) => ({
        breadNo: item.no,
        quantity: item.quantity,
      })),
      deliveryMethodNo: selectedDelivery?.no,
      deliveryTypeCode: selectedDelivery?.deliveryTypeCode,
      customerCouponNo: selectedCoupon?.no,
      totalPrice,
      ...data,
    };

    try {
      await createMutation.mutateAsync(body);
      toast.success('주문이 완료되었습니다.');
    } catch (error) {
      toast.error('주문을 실패하였습니다.');
    }
  };

  /** 배송방법 기본값 설정 */
  useEffect(() => {
    if (deliveryData) {
      setSelectedDelivery(deliveryData[0]);
    }
  }, [deliveryData]);

  /** 쿠폰 기본값 설정 */
  useEffect(() => {
    if (myContact && couponData.length > 0) {
      setSelectedCoupon(couponData[0]);
    }
  }, [myContact, couponData]);

  return false ? (
    <OrderFormSkeleton />
  ) : (
    <div className="space-y-4 pb-24">
      {/* 안내 영역 */}
      <div className="bg-secondary rounded-sm p-2 shadow-md space-y-1 border-white border-4">
        <p className="text-sm text-primary">{orderRoundData?.no}차 주문서가 오픈했습니다!</p>

        <p className="text-sm text-primary">
          해당 주문은 종류와 상관없이 <u>최소 {orderRoundData?.minOrderQty}개</u>부터{' '}
          <u>최대 {orderRoundData?.maxOrderQty}개</u>
          까지 주문이 가능합니다.
        </p>

        <p className="text-sm text-primary">
          마감일: <u>{formatIsoToDateTime(orderRoundData?.endedAt || '')}</u>
        </p>
      </div>

      {/* 빵 목록 영역 */}
      <div>
        <p className="pb-2 font-semibold">이번 주문차수에 포함된 빵을 확인하고 추가하세요!</p>

        {orderRoundData.orderRoundBreads?.map((data: any, i: number) => (
          <BreadItem
            key={i}
            bread={data}
            handleSelectedBread={handleSelectedBread}
            maxOrderQty={orderRoundData?.maxOrderQty}
            totalQuantity={totalQuantity}
            isSelected={selectedBreads.some((item) => item.no === data.no)}
          />
        ))}
      </div>

      {/* 금액 영역  */}
      <div className="space-y-2">
        <div className="flex flex-row items-center gap-2">
          <div className="w-24">배송방법</div>
          <Select
            value={selectedDelivery?.no.toString() ?? ''}
            onValueChange={(value) => {
              setSelectedDelivery(deliveryData?.find((item: any) => item.no.toString() === value));
            }}
          >
            <SelectTrigger id="deliveryMethodNo" className="min-w-40 bg-white">
              <SelectValue placeholder="배송방법 선택" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>배송방법</SelectLabel>
                {deliveryData?.map((delivery: any, idx: number) => {
                  return (
                    <SelectItem key={idx} value={delivery.no.toString()}>
                      {delivery.deliveryTypeName}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 멤버이고, 쿠폰이 있을때만 조회 */}
        {myContact && couponData.length > 0 && (
          <div className="flex flex-row items-center gap-2">
            <div className="w-24">내 쿠폰</div>
            <Select
              value={selectedCoupon?.no.toString() ?? ''}
              onValueChange={(value) => {
                setSelectedCoupon(couponData?.find((item: any) => item.no.toString() === value));
              }}
            >
              <SelectTrigger id="couponNo" className="min-w-40">
                <SelectValue placeholder="내 쿠폰 선택" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>내 쿠폰</SelectLabel>
                  {couponData?.map((coupon: any, idx: number) => {
                    return (
                      <SelectItem key={idx} value={coupon.no.toString()}>
                        {coupon.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 금액 요약 */}
        <div className="flex flex-col items-end">
          <div className="flex flex-row items-center gap-2">
            <p>상품 금액({totalQuantity}개 주문):</p>
            <p className="min-w-40 text-right">{totalBreadPrice} 원</p>
          </div>
          {selectedDelivery?.deliveryTypeCode === '10' && (
            <div className="flex flex-row items-center gap-2">
              <p>배송비</p>
              <p className="min-w-40 text-right">{selectedDelivery?.fee} 원</p>
            </div>
          )}
          {selectedCoupon && (
            <div className="flex flex-row items-center gap-2">
              <p>할인금액:(수정필요)</p>
              <p className="min-w-40 text-right">{selectedCoupon?.discountAmount}원</p>
            </div>
          )}
          <div className="flex flex-row items-center gap-2">
            <p className="text-lg font-bold">총 금액:</p>
            <p className="font-bold min-w-40 text-right">{totalPrice}원</p>
          </div>
        </div>
      </div>

      {/* 고객 정보 영역  */}
      <div className="bg-white rounded-sm p-6 shadow-md">
        <p className="pb-2 font-semibold">고객님의 정보를 입력해주세요!</p>

        <OrderForm
          isDelivery={selectedDelivery?.deliveryTypeCode === '10'}
          myContact={myContact}
          onSubmit={createOrder}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
