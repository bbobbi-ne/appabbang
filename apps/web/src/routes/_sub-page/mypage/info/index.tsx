/**
 * 마이페이지 - 정보수정
 */

import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import InfoPage from '@/components/pages/info-page';
import CustomerInfoCard from '@/components/mypage/customer-info-card';
import { useCustomerStore } from '@/store/customer';
import { useEffect, useState } from 'react';
import { useAccessTokenStore } from '@/store/session';
import { getCustomerInfo } from '@/services/customer-apis';

export const Route = createFileRoute('/_sub-page/mypage/info/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { accessToken } = useAccessTokenStore();
  const { customer } = useCustomerStore();
  const [customerDetail, setCustomerDetail] = useState();
  const [couponQty, setCouponQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  /**
   * 고객 상세정보 조회
   */
  useEffect(() => {
    (async () => {
      // 고객 상세정보, 고객의 보유 쿠폰 정보, 주문 총 금액 조회
      const { customer, coupon, totalAmount } = await getCustomerInfo(accessToken);
      setCustomerDetail(customer);
      console.log(customer);

      setCouponQty(coupon.length);
      setTotalAmount(totalAmount);
    })();
  }, [customer]);

  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard
        id={customer.id}
        name={customer.name}
        couponQty={couponQty}
        totalAmount={totalAmount}
      />
      <InfoPage customer={customerDetail} />
    </SubLayout>
  );
}
