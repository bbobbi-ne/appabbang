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
}

/** 빵 카드 */
export interface BreadCardProps {
  bread: BreadProps;
  onClick: (bread: BreadCardProps['bread']) => void;
}

/** 결제목록 :: 빵 정보 타입 */
export interface PaymentProp {
  key: number;
  bread: BreadProps;
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
  deliveryType: string;
  deliveryTypeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankCodeProps {
  code: string;
  name: string;
}
