import { useState } from 'react';
import { Button } from '@appabbang/ui';
import { BreadDialog } from '@/components/order-round/bread-dialog';
import { CountButton } from '@/components/order-round/count-button';
import { CheckIcon } from 'lucide-react';

type Props = {
  bread: any;
  handleSelectedBread: (bread: any, quantity: number) => void;
  maxOrderQty: number;
  totalQuantity: number;
  isSelected: boolean;
};

/** 빵 아이템 컴포넌트, 주문서 의존적  */
export const BreadItem = ({
  bread,
  handleSelectedBread,
  maxOrderQty,
  totalQuantity,
  isSelected,
}: Props) => {
  const [count, setCount] = useState(0);

  /** 카운트 증가 함수 (최대 주문 개수 초과 검증) */
  const handleIncreaseCount = () => {
    if (totalQuantity + 1 > maxOrderQty) {
      alert('최대 주문 개수를 초과했습니다.');
      return;
    }

    const quantity = count + 1;
    setCount(quantity);
    handleSelectedBread(bread, quantity);
  };

  /** 카운트 감소 함수 */
  const handleDecreaseCount = () => {
    const quantity = count - 1;
    if (quantity < 0) return;

    setCount(quantity);
    handleSelectedBread(bread, quantity);
  };

  /** 카운트 변경 함수 */
  const handleCountChange = (type: 'plus' | 'minus') => {
    type === 'plus' && handleIncreaseCount();
    type === 'minus' && handleDecreaseCount();
  };

  return (
    <div className="flex flex-row items-center gap-4 p-2 bg-background border-b hover:bg-white">
      <img
        src={bread.images[0]?.url || '/images/no-image.png'}
        alt={bread.name}
        className="w-16 h-16"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-base">{bread.name}</p>
          {isSelected && (
            <CheckIcon className="w-5 h-5 text-white bg-green-600 rounded-full shadow-md" />
          )}
        </div>
        <p className="text-sm text-gray-500">{bread?.unitPrice?.toLocaleString()}원</p>
        <BreadDialog bread={bread}>
          <Button size="sm">빵 정보 보기</Button>
        </BreadDialog>
      </div>

      <div className="flex-1" />

      <CountButton count={count} handleCountChange={handleCountChange} />
    </div>
  );
};
