import { useEffect, useState } from 'react';
import InfoForm from '../mypage/info-form';
import { getCustomerInfo } from '@/services/customer-apis';
import { useCustomerStore } from '@/store/customer';

interface IAddressProps {
  no: number;
  address: string;
  addressDetail: string;
  zipcode: string;
  message: string;
  recipientName: string;
  recipientMobile: string;
  customerNo: number;
}

interface ICustomerCouponProps {
  no: number;
  issuedAt: string;
  expiredAt: string;
  isUsed: boolean;
  isExpired: boolean;
  customerNo: number;
  couponNo: number;
}

export interface ICustomerProps {
  no: number;
  id: string;
  name: string;
  mobileNumber: string;
  defaultAddressNo: number;
  address: IAddressProps[];
  customerCoupon: ICustomerCouponProps[];
  createdAt: string;
}

// 마이페이지 정보 페이지
export default function InfoPage() {
  const [customer, setCustomer] = useState();

  /**
   * 고객 상세정보 조회
   */
  useEffect(() => {
    (async () => {
      // 고객 상세정보, 고객의 보유 쿠폰 정보, 주문 총 금액 조회
      const { customer } = await getCustomerInfo();
      setCustomer(customer);
    })();
  }, []);

  return <InfoForm customer={customer} />;
}
