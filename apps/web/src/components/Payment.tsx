/**
 * 빵 결제목록
 */
import { Button, Card, CardContent, CardTitle, Input } from '@appabbang/ui';
import { useEffect, useState } from 'react';
import type { PaymentProp } from '../interface/BreadInterface';

/** plus, minus 버튼 CSS */
const countBtnCss = `
  mr-2 cursor-pointer
  bg-[#eeeeee] text-[#2a2a2a]
  border 
  hover:text-[#222222] hover:bg-[#eeeeee] hover:border-[#222222] 
`;

/** Main Function */
function Payment({ bread, handlers }: PaymentProp) {
  const [count, setCount] = useState<number>(0); // 수량
  const [amount, setAmount] = useState<number>(0); // 금액
  const [type, setType] = useState<string>('');

  /** React Hooks  */
  useEffect(() => {
    const price = bread.unitPrice;

    setCount(1);
    setAmount(price);
    setType('minus');

    // 초기값을 부모 컴포넌트로 전달
    // handlers.onCountChange(bread, 1, price, '');
  }, []);

  /** Functions */
  /** 결제목록 컴포넌트의 수량을 변경하고 form(부모) 컴포넌트로 빵 정보와 수량, 총 금액 전달 */
  const countHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnVal = e.currentTarget.value;

    const newCount = btnVal.includes('plus') ? count + 1 : count > 1 ? count - 1 : 1;
    const newAmount = bread.unitPrice * newCount;

    bread.count = newCount;
    bread.price = newAmount;

    // 상태 업데이트
    setCount(newCount);
    setAmount(newAmount);
    setType(btnVal);

    // 부모 컴포넌트로 즉시 전달
    handlers.onCountChange(bread, btnVal);

    // minus 버튼이고 수량이 1이 될 때 제거
    btnVal.includes('minus') && count === 1 && handlers.onRemove?.(bread);
  };

  return (
    <Card className="flex flex-row items-start m-4">
      <CardTitle className="mt-auto mb-auto ml-8 h-auto w-1/3 text-[18px] ">{bread.name}</CardTitle>

      <div className="flex flex-row items-start *:mt-5 *:mb-5">
        <Input type="text" className="m-4 text-right w-15" disabled value={count} />
        <Button type="button" className={countBtnCss} value="plus" onClick={countHandler}>
          +
        </Button>
        <Button type="button" className={countBtnCss} value="minus" onClick={countHandler}>
          -
        </Button>
      </div>

      <div className="flex flex-row items-start ml-20 text-2xl *:mt-5 *:mb-5">
        <Button type="button" className={`w-10 bg-white text-[#222222]`} disabled>
          X
        </Button>
      </div>

      <CardContent className="ml-auto mt-auto mb-auto">
        <p className="mt-5">{amount.toLocaleString()} 원</p>
      </CardContent>
    </Card>
  );
}

export default Payment;
