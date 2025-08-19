import useToast from '@/hooks/useToast';
import { Button, Card } from '@appabbang/ui';
import { useNavigate } from '@tanstack/react-router';
import useCountDownTimer from '@/hooks/useCountDownTimer';
import { AlarmClock } from 'lucide-react';
import { formatDate } from '@/utils';
interface IOrderRoundProps {
  data: {
    no: number;
    name: string;
    startedAt: Date;
    endedAt: Date;
    breadNoList: {
      breadNo: number;
    }[];
    image?: {
      url: string;
      name: string;
    };
  };
}

export default function OrderContent({ data }: IOrderRoundProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // 주문차수 진행여부(run), 남는시간정보(remaningTime)
  const { run: isRun, remaningTime } = useCountDownTimer(
    data?.startedAt?.toString(),
    data?.endedAt?.toString(),
  );

  /**
   * 주문진행여부값이 false면 주문서 form을 작성할 수 없다.
   * 주문진행여부값이 true면 주문서 form을 작성할 수 있도록 화면 이동할 수 있다.
   * @returns
   */
  const onClick = () => {
    if (!isRun) {
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
    <div>
      <div className="container mx-auto px-2 py-10 overflow-hidden">
        <div className="flex flex-row justify-between gap-4 items-center">
          {/* 왼쪽 영역 */}
          <Card className="flex-1 rounded-lg overflow-hidden border-0 shadow-xl">
            <img
              // TODO: 주문차수 이미지가 없을때를 대비한 샘플 이미지 제작 필요
              src={data?.image?.url ?? '/images/main-order-round-no-img.png'}
              alt={data?.image?.name ?? '주문차수 이미지'}
              className="w-full h-auto object-cover"
            />
          </Card>

          {/* 오른쪽 영역 */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="space-y-2">
              <div className="text-2xl lg:text-4xl">
                {data?.no}차 주문 {isRun && '오픈!'}
              </div>
              <p className="text-xs lg:text-base text-gray-500">
                {isRun ? '망설이면 늦어요!' : `오픈 예정일: ${formatDate(data?.startedAt || '')}`}
              </p>
            </div>

            {isRun && (
              <Card className="flex-1 p-4 space-y-4 lg:space-y-12">
                <div className="flex flex-row gap-2 items-end">
                  <AlarmClock size={28} className="animate-bounce transition-all duration-300" />
                  <p className="text-2xl lg:text-4xl">{remaningTime}</p>
                </div>

                <Button className="block ml-auto" onClick={onClick}>
                  주문하러 가기
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
