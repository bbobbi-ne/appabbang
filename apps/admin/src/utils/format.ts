import { format, parse } from 'date-fns';

export function formatKR(value: string | number): string {
  return value
    ? new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
      }).format(Number(value.toString().replace(/,/g, '')))
    : '';
}
export function formatToDate(Date: Date) {
  return format(Date, 'yyyy-MM-dd');
}
export function formatToDateTime(date: Date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatToDateTimeIso(date: Date, time: string) {
  const dateString = format(date, 'yyyy-MM-dd');
  const dateTimeString = `${dateString} ${time}`;

  // 2. date-fns로 Date 객체 생성
  const combined = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date());

  // 3. UTC ISO 문자열로 변환
  const isoString = combined.toISOString();

  return isoString;
}

/**
 * ISO 문자열을 yyyy-MM-dd HH:mm 형식으로 변환
 */
export function formatIsoWithoutSeconds(isoString: string) {
  return format(new Date(isoString), 'yyyy-MM-dd HH:mm');
}
