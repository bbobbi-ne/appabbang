import type { OrderRoundDetailData } from '@/api/data-contracts';

export type OrderRoundBreadWithCount = OrderRoundDetailData['orderRoundBreads'][number] & {
  count: number;
};

export type BreadProps = OrderRoundDetailData['orderRoundBreads'];

/** 결제목록 :: 빵 정보 타입 */
export interface PaymentProp {
  key: number;
  bread: OrderRoundBreadWithCount;
  min: number;
  max: number;
  handlers: {
    onCountChange: (bread: OrderRoundBreadWithCount, type: string) => void;
    onRemove?: (bread: OrderRoundBreadWithCount) => void;
  };
}

/** 배송방법 목록 타입 */
export interface DeliveryProps {
  no: number;
  name: string;
  memo: string;
  fee: number;
  isActive: boolean;
  deliveryTypeCode: string;
  deliveryTypeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankCodeProps {
  code: string;
  name: string;
}
