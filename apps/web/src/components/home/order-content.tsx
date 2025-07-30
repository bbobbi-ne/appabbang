import useToast from '@/hooks/useToast';
import { Button, Card } from '@appabbang/ui';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function OrderContent() {
  const [standardHour, setStandardHour] = useState<number>(0); // 시간 없음
  const [standardMinute, setStandardMinute] = useState<number>(0); // 분 없음
  const [second, setSecond] = useState<number>(10); // 60초 남음
  const [clickFlag, setClickFlag] = useState<boolean>(true); // 주문하기 버튼 상태
  const navigate = useNavigate();
  const { addToast } = useToast();

  /** 화면에 들어오자마자 시작함
   * origin 기준 : 주문차수를 먼저 조회해서 주문차수의 시작일자가 현재일자보다 이전이고 주문차수의 종료일자가 현재일자보다 이후면 시작한다.
   *
   * 현재는 주문차수 정보가 없으므로 '1분 남은 시점'으로 처리한다.
   */
  useEffect(() => {
    setTimeout(() => {
      second !== 0 ? setSecond(second - 1) : setSecond(0);
    }, 1000);

    onCheckTime();
  }, [second]);

  /**
   * 시간, 분, 초가 모두 0시 0분 0초 남았다면, 주문서 작성 버튼을 누를 수 없게 flag를 변경한다.
   */
  const onCheckTime = () => {
    if (standardHour === 0 && standardMinute === 0 && second === 0) setClickFlag(false);
  };

  /**
   * flag값이 false면 주문서 form을 작성할 수 없다.
   * flag값이 true면 주문서 form을 작성할 수 있도록 화면 이동할 수 있다.
   * @returns
   */
  const onClickOrderForm = () => {
    if (!clickFlag) {
      addToast({
        message: '해당 주문은 마감되었습니다.',
        type: 'error',
      });
      return;
    }

    navigate({ to: '/order/form' });
  };

  return (
    <div className="flex flex-row justify-center w-full mt-30 m-auto gap-15">
      <div className="flex flex-col w-1/5 h-72">
        <div className={clsx('text-3xl mt-5 mb-5', 'md:text-2xl')}>13차 주문 오픈!</div>
        <Card className="w-full h-full">
          <div className={clsx('mt-10 mb-10 text-center text-3xl font-bold', 'md:text-2xl')}>
            00 : 00 : {second < 10 ? `0${second}` : second}
          </div>
          <div className={clsx('flex gap-5 justify-center', 'md:gap-2')}>
            <span className={clsx('pt-4 font-bold text-gray-300')}>망설이면 늦어요!</span>
            <Button className="pt-8 pb-8" type="button" onClick={onClickOrderForm}>
              주문서 작성
            </Button>
          </div>
        </Card>
      </div>
      <div className="border w-2/5">
        <img src="" alt="주문차수 대표이미지" />
      </div>
    </div>
  );
}
