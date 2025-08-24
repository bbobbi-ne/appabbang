import { useEffect, useState } from 'react';
import { parseISO, isBefore, isAfter, differenceInSeconds, intervalToDuration } from 'date-fns';

export function useCountDownTimer(startedAt: string, endedAt: string) {
  const [remainingTime, setRemainingTime] = useState<string>('0일 00:00:00');
  const [run, setRun] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = parseISO(startedAt);
      const end = parseISO(endedAt);

      const isInRange =
        isAfter(now, new Date(start.getTime() - 24 * 60 * 60 * 1000)) &&
        isBefore(now, new Date(end.getTime() + 24 * 60 * 60 * 1000));

      if (isInRange) {
        const diffInSeconds = differenceInSeconds(end, now);

        if (diffInSeconds <= 0) {
          setRemainingTime('0일 00:00:00');
          setRun(false);
          return;
        }

        const duration = intervalToDuration({ start: 0, end: diffInSeconds * 1000 });

        const days = duration.days ?? 0;
        const hours = String(duration.hours ?? 0).padStart(2, '0');
        const minutes = String(duration.minutes ?? 0).padStart(2, '0');
        const seconds = String(duration.seconds ?? 0).padStart(2, '0');

        setRemainingTime(`${days}일 ${hours}:${minutes}:${seconds}`);
        setRun(true);
      } else {
        setRemainingTime('0일 00:00:00');
        setRun(false);
      }
    };

    calculateTime();
    const intervalId = setInterval(calculateTime, 1000);

    return () => clearInterval(intervalId);
  }, [startedAt, endedAt]);

  return { run, remainingTime };
}
