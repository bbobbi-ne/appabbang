import { useEffect, useState } from 'react';
import InfoForm from '../mypage/info-form';
import { getCustomerInfo } from '@/services/customer-apis';
import { useQuery } from '@tanstack/react-query';

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
  const { isLoading, data } = useQuery({
    queryKey: ['getCustomerInfo'],
    queryFn: getCustomerInfo,
  });

  useEffect(() => {
    !isLoading && setCustomer(data.customer);
  }, [data]);

  return <InfoForm customer={customer} />;
}
