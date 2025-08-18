/** 빵 정보 */
export interface BreadProps {
  no: number;
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: number;
  images: [
    {
      url: string;
    },
  ];
  count: number;
  price: number;
  allergyInfo: string;
  countryOfOrigin: string;
}

export interface IOrderRoundBreads {
  bread: BreadProps;
}

/** 빵 카드 */
export interface BreadCardProps {
  bread: BreadProps;
  openBread?: OrderRoundBreads[];
  onClick: (bread: BreadCardProps['bread']) => void;
}

/** 결제목록 :: 빵 정보 타입 */
export interface PaymentProp {
  key: number;
  bread: BreadProps;
  min: number;
  max: number;
  handlers: {
    onCountChange: (bread: BreadProps, type: string) => void;
    onRemove?: (bread: BreadProps) => void;
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

export interface OrderRoundBreads {
  // endedAt: string;
  // name: string;
  // no: number;
  // orderRoundBreads: { seq: number; breadNo: number };
  seq: number;
  breadNo: number;
  // startedAt: string;
}
