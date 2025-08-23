import InfoForm from '@/components/mypage/info-form';
import { useGetCustomerInfoQuery, useUpdateCustomerMutation } from '@/hooks/use-my';
import Loading from '@/components/common/loading';

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
  const { data, isSuccess } = useGetCustomerInfoQuery();
  const updateCustomerMutation = useUpdateCustomerMutation();

  if (!isSuccess) return <Loading />;

  return (
    <InfoForm
      customer={data?.customer}
      updateMutation={updateCustomerMutation.mutateAsync}
      isSubmitting={updateCustomerMutation.isPending}
    />
  );
}
