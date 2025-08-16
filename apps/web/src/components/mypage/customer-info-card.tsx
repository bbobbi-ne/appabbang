/**
 * 고객 정보 Card
 */

import { Card, CardContent } from '@appabbang/ui';
import MenuButton from './menu-button';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import { useEffect, useState } from 'react';
import { getCustomerInfo } from '@/services/customer-apis';

function CustomerInfoCard() {
  const { accessToken } = useAccessTokenStore();
  const {
    customer: { id, name },
  } = useCustomerStore();
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
    <div className="flex flex-col">
      <Card className="w-full h-full ml-auto mr-auto">
        <CardContent>
          <div className="flex flex-row items-center mt-5">
            <div className="w-6/12 text-center">
              <span className="font-bold">
                {name}({id})
              </span>
              님 안녕하세요.
            </div>
            <div className="w-3/12 *:text-center *:m-5 border-r border-l">
              <p>누적금액</p>
              <p className="font-bold ">{totalAmount}원</p>
            </div>
            <div className="w-3/12 *:text-center *:m-5">
              <p>총 보유 쿠폰 수</p>
              <p className="font-bold ">{couponQty}개</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MenuButton />
    </div>
  );
}

export default CustomerInfoCard;
