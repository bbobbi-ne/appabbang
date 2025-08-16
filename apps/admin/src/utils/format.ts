import { format, parse } from 'date-fns';

/**
 * 💰 KRW 통화 형식으로 숫자 변환
 * @param value 숫자 또는 문자열
 * @returns '₩1,000' 형식의 문자열
 */
export function formatCurrencyKR(value: string | number): string {
  if (!value) return '';
  const numericValue = Number(value.toString().replace(/,/g, ''));
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/**
 * 📅 Date 객체를 'yyyy-MM-dd' 형식으로 변환
 * @param date Date 객체
 * @returns '2025-08-14' 형태 문자열
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 🕒 Date 객체를 'yyyy-MM-dd HH:mm:ss' 형식으로 변환
 * @param date Date 객체
 * @returns '2025-08-14 13:45:30' 형태 문자열
 */
export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * ⏱ 날짜(Date) + 시간 문자열 -> ISO 8601 문자열
 * @param date Date 객체
 * @param time 'HH:mm:ss' 형태 문자열
 * @returns '2025-08-14T13:45:30.000Z' ISO 문자열
 */
export function formatDateTimeToIso(date: Date, time: string): string {
  const dateString = format(date, 'yyyy-MM-dd');
  const dateTimeString = `${dateString} ${time}`;
  const combined = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date());
  return combined.toISOString();
}

/**
 * 🕒 ISO 문자열을 'yyyy-MM-dd HH:mm:ss' 형식으로 변환
 * @param isoString ISO 8601 문자열
 * @returns '2025-08-14 13:45:30' 형태 문자열
 */
export function formatIsoToDateTime(isoString: string): string {
  return format(new Date(isoString), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 🔢 숫자 형식으로 변환 (천 단위 콤마)
 * @param value 숫자 또는 문자열
 * @returns '1,000' 형태 문자열
 */
export function formatNumber(value: string | number): string {
  if (!value) return '';
  const numericValue = Number(value.toString().replace(/,/g, ''));
  return numericValue.toLocaleString('ko-KR');
}
