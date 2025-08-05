import useToast from '@/hooks/useToast';
import { Button, Card } from '@appabbang/ui';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useCountDownTimer from '@/hooks/useCountDownTimer';

interface IOrderRound {
  no: number;
  name: string;
  startedAt: string;
  endedAt: string;
  breadNoList: {
    breadNo: number;
  }[];
  image?: {
    url: string;
    name: string;
  };
}

interface IOrderRoundProps {
  data: IOrderRound;
}

interface IImage {
  url: string;
  name: string;
}

export default function OrderContent({ data }: IOrderRoundProps) {
  const [clickFlag, setClickFlag] = useState<boolean>(true); // 주문하기 버튼 상태
  const [img, setImg] = useState<IImage>(); // 이미지 정보
  const navigate = useNavigate();

  // 주문차수 진행여부(run), 남는시간정보(remaningTime)
  const { run, remaningTime } = useCountDownTimer(data.startedAt, data.endedAt);
  const { addToast } = useToast();

  /** 주문차수 진행중이면 주문하기 버튼상태 변경 */
  useEffect(() => {
    run && setClickFlag(run);
  }, []);

  /** 주문차수의 이미지 설정 */
  useEffect(() => {
    data && data.image ? setImg({ url: data.image.url, name: data.image.name }) : null;
  }, [data]);

  /**
   * flag값이 false면 주문서 form을 작성할 수 없다.
   * flag값이 true면 주문서 form을 작성할 수 있도록 화면 이동할 수 있다.
   * @returns
   */
  const onClick = () => {
    if (!clickFlag) {
      addToast({
        message: '해당 주문은 마감되었습니다.',
        type: 'error',
      });
      return;
    }

    // 주문차수 파라미터와 함께 전달
    navigate({
      to: '/order/$orderRoundNo',
      params: { orderRoundNo: String(data.no) },
    });
  };

  return (
    <div className="flex flex-row justify-center w-full mt-30 m-auto gap-15">
      <div className="flex flex-col w-1/5 h-72">
        {run ? (
          <>
            <div className={clsx('text-3xl mt-5 mb-5', 'md:text-2xl')}>{data.name} 진행중!</div>
            <Card className="w-full h-full">
              <div className={clsx('mt-10 mb-10 text-center text-3xl font-bold', 'md:text-2xl')}>
                {remaningTime}
              </div>
              <div className={clsx('flex gap-5 justify-center', 'md:gap-2')}>
                <span className={clsx('pt-4 font-bold text-gray-300')}>망설이면 늦어요!</span>
                <Button className="pt-8 pb-8" type="button" onClick={onClick}>
                  주문서 작성
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <>
            <div className={clsx('text-3xl mt-5 mb-5', 'md:text-2xl')}>
              현재 진행중인 주문이 없어요!
            </div>
            <Card className="w-full h-full">
              <div className={clsx('mt-10 mb-10 text-center text-3xl font-bold', 'md:text-2xl')}>
                {remaningTime}
              </div>
              <div className={clsx('flex gap-5 justify-center', 'md:gap-2')}>
                <span className={clsx('pt-4 font-bold text-gray-300')}>다음에 만나요!</span>
                <Button className="pt-8 pb-8" type="button" disabled>
                  주문서 작성
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>

      {run ? (
        <div className="border w-2/5 h-72 overflow-hidden">
          {img ? (
            <img className="w-full h-full object-contain" src={img.url} alt={img.name} />
          ) : null}
        </div>
      ) : (
        <div className="border w-2/5 h-72 overflow-hidden"></div>
      )}
    </div>
  );
}
