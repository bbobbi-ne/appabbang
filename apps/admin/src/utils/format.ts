import { format } from 'date-fns';

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
