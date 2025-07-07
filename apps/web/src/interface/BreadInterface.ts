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
