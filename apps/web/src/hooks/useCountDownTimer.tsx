/**
 * 날짜 어느정도 남았는지 카운트다운 해주는 커스텀 훅.
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

/**
 * 현재시간과의 차이를 구해 남은 시간을 계산한다.
 * @params targetTime 기한일시
 */
function useCountDownTimer(startedAt: string, endedAt: string) {
  dayjs.extend(duration);

  const [remaningTime, setRemaningTime] = useState<string>('');
  const [run, setRun] = useState<boolean>(false);

  useEffect(() => {
    /** 남은 시간 계산하기 */
    const calculateTime = () => {
      // 시작하기 전, 현재일시가 시작/종료일시에 포함되는지 확인
      const now = dayjs(); // 현재
      const start = dayjs(startedAt); // 시작
      const end = dayjs(endedAt); // 종료

      const isInRange = now.isAfter(start.subtract(1, 'day')) && now.isBefore(end.add(1, 'day'));

      // 포함여부 확인
      if (isInRange) {
        const currentDate = dayjs(); // 현재일시
        const targetDate = dayjs(endedAt); // 종료일시
        const duration = dayjs.duration(targetDate.diff(currentDate)); // 종료일시와 현재일시의 차이

        const [minutes, seconds] = [
          String(duration.minutes()).padStart(2, '0'),
          String(duration.seconds()).padStart(2, '0'),
        ];

        // 남는 시 : 분 : 초
        setRemaningTime(`${Math.floor(duration.asHours())} : ${minutes} : ${seconds}`);
        setRun(true);
      } else {
        setRemaningTime('00 : 00 : 00');
      }
    };

    calculateTime();

    const intervalId = setInterval(calculateTime, 1000); // 1초마다 호출
    return () => clearInterval(intervalId); // useEffect clear
  }, [endedAt]);

  return { run, remaningTime };
}

export default useCountDownTimer;
