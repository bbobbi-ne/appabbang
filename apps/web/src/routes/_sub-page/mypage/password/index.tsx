import { createFileRoute } from '@tanstack/react-router';
import PasswordPage from '@/components/pages/password-page';
import SubLayout from '@/components/templates/sub-layout';
import CustomerInfoCard from '@/components/mypage/customer-info-card';
import { useEffect, useState } from 'react';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import { getCustomerInfo } from '@/services/customer-apis';

export const Route = createFileRoute('/_sub-page/mypage/password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { accessToken } = useAccessTokenStore();
  const { customer } = useCustomerStore();
  const [_, setCustomerDetail] = useState();
  const [couponQty, setCouponQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  /**
   * 고객 상세정보 조회
   */
  useEffect(() => {
    (async () => {
      const { customer, coupon, totalAmount } = await getCustomerInfo(accessToken);
      setCustomerDetail(customer);
      setCouponQty(coupon.length);
      setTotalAmount(totalAmount);
    })();
  }, [accessToken]);

  return (
    <SubLayout title="마이페이지">
      <CustomerInfoCard
        id={customer.id}
        name={customer.name}
        couponQty={couponQty}
        totalAmount={totalAmount}
      />
      <PasswordPage />
    </SubLayout>
  );
}
