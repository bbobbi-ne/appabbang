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
}

/** 빵 카드 */
export interface BreadCardProps {
  idx: number;
  bread: BreadProps;
  onClick: (bread: BreadCardProps['bread']) => void;
}

/** 결제목록 :: 빵 정보 타입 */
export interface PaymentProp {
  key: number;
  bread: BreadProps;
  onClick: (bread: BreadProps, count: number, amount: number) => void;
}
