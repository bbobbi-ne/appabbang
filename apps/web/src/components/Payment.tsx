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
function Payment({ bread, onClick }: PaymentProp) {
  const [count, setCount] = useState<number>(0); // 수량
  const [amount, setAmount] = useState<number>(0); // 금액

  /** React Hooks  */
  useEffect(() => {
    setCount(1);
    setAmount(bread.unitPrice);
  }, []);

  /** Functions */
  /** 결제목록 컴포넌트의 수량을 변경하고 form(부모) 컴포넌트로 빵 정보와 수량, 총 금액 전달 */
  const countHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnVal = e.currentTarget.value;
    let newCount = 0;
    let newAmount = 0;
    // +, - 버튼 클릭 시 수량 증가, 감소 처리. 이 때, 최소한 1개 미만으로 내려가지 않도록 할 것.
    setCount((prev) => {
      newCount = btnVal.includes('plus') ? prev + 1 : prev > 1 ? prev - 1 : 1;
      newAmount = bread.unitPrice * newCount;
      onClick(bread, newCount, newAmount); // 빵 정보, 수량, 금액
      return newCount;
    });

    setAmount((_) => {
      return newAmount;
    });
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

      <CardContent className="ml-auto mt-auto mb-auto">{amount.toLocaleString()} 원</CardContent>
    </Card>
  );
}

export default Payment;
