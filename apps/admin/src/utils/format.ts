export function formatKR(value: string | number): string {
  return value
    ? new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
      }).format(Number(value.toString().replace(/,/g, '')))
    : '';
}
