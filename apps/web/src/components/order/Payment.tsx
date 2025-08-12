/**
 * 빵 결제목록
 */
import { Button, Card, CardContent, CardTitle, Input } from '@appabbang/ui';
import { useEffect, useState } from 'react';
import type { PaymentProp } from '@/interface/bread-interface';

/** plus, minus 버튼 CSS */
const countBtnCss = `
  mr-2 cursor-pointer
  bg-[#eeeeee] text-[#2a2a2a]
  border 
  hover:text-[#222222] hover:bg-[#eeeeee] hover:border-[#222222] 
`;

/** Main Function */
function Payment({ bread, min, max, handlers }: PaymentProp) {
  const [count, setCount] = useState<number>(min); // 수량
  const [amount, setAmount] = useState<number>(0); // 금액

  /** React Hooks  */
  useEffect(() => {
    setAmount(bread.unitPrice);
  }, []);

  /** Functions */
  /** 결제목록 컴포넌트의 수량을 변경하고 form(부모) 컴포넌트로 빵 정보와 수량, 총 금액 전달 */
  const countHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnVal = e.currentTarget.value;

    let newCount = btnVal.includes('plus') ? count + 1 : count > 1 ? count - 1 : 1;
    const newAmount = bread.unitPrice * newCount;

    bread.count = newCount;
    bread.price = newAmount;

    // 수량은 최대주문수량까지만 넘어갈 수 있음
    newCount = newCount <= max ? newCount : max;

    // 상태 업데이트
    setCount(newCount);
    setAmount(newAmount);

    // 부모 컴포넌트로 즉시 전달
    handlers.onCountChange(bread, btnVal);

    // minus 버튼이고 수량이 1이 될 때 제거
    btnVal.includes('minus') && count === 1 && handlers.onRemove?.(bread);
  };

  // 수량 수정 가능하도록 변경하는 함수
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);

    // 최소, 최대 수량 제한
    if (value < min) value = min;
    if (value > max) value = max;

    setCount(value);

    const newAmount = bread.unitPrice * value;
    setAmount(newAmount);

    bread.count = value;
    bread.price = newAmount;

    handlers.onCountChange(bread, 'input');
  };

  return (
    <Card className="flex flex-row items-start m-4">
      <CardTitle className="mt-auto mb-auto ml-8 h-auto w-1/3 text-[18px] ">{bread.name}</CardTitle>

      <div className="flex flex-row items-start *:mt-5 *:mb-5">
        <Input type="number" className="m-4 text-right w-20" value={count} onChange={onChange} />
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
