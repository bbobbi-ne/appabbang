import { ko } from 'date-fns/locale';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const KST_TZ = 'Asia/Seoul';

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
 * 📅 Date 객체를 'yyyy-MM-dd' 형식으로 변환 (KST)
 * @param date Date 객체
 * @returns '2025-08-14' 형태 문자열
 */
export function formatDate(date?: Date | string): string {
  if (!date) return '';
  const kstDate = toZonedTime(new Date(date), KST_TZ);
  return formatInTimeZone(kstDate, KST_TZ, 'yyyy-MM-dd');
}

/**
 * 🕒 Date 객체를 'yyyy년 MM월 dd일 HH시mm분ss초' 형식으로 변환 (KST)
 * @param date Date 객체
 * @returns '2025-08-14 13시45분30초' 형태 문자열
 */
export function formatDateTime(date?: Date | string): string {
  if (!date) return '';
  const kstDate = toZonedTime(new Date(date), KST_TZ);
  return formatInTimeZone(kstDate, KST_TZ, 'yyyy년 MM월 dd일 HH시mm분ss초', { locale: ko });
}

/**
 * ⏱ Date 객체를 ISO 8601 문자열로 변환 (UTC 기준)
 * @param date Date 객체
 * @returns '2025-08-14T13:45:30.000Z' 형태 문자열
 */
export function formatDateTimeToIso(date: Date | string): string {
  return new Date(date).toISOString(); // ISO는 항상 UTC
}

/**
 * 🕒 ISO 문자열을 'yyyy-MM-dd HH:mm:ss' 형식으로 변환 (KST)
 * @param isoString ISO 문자열
 * @returns '2025-08-14 13:45:30' 형태 문자열
 */
export function formatIsoToDateTime(isoString: string): string {
  const kstDate = toZonedTime(new Date(isoString), KST_TZ);
  return formatInTimeZone(kstDate, KST_TZ, 'yyyy-MM-dd HH:mm:ss', { locale: ko });
}

/**
 * 🕒 ISO 문자열을 'yyyy-MM-dd' 형식으로 변환 (KST)
 * @param isoString ISO 문자열
 * @returns '2025-08-14' 형태 문자열
 */
export function formatIsoToDate(isoString: string): string {
  const kstDate = toZonedTime(new Date(isoString), KST_TZ);
  return formatInTimeZone(kstDate, KST_TZ, 'yyyy-MM-dd', { locale: ko });
}

/**
 * 연락처 하이픈 추가
 * @param value 전화번호형식의 문자열
 * @returns 숫자 길이에 따른 전화번호 형식의 문자열 예: 000-000-0000
 */
export const formatMobile = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, '');
  if (onlyNumbers.length === 10) return onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  if (onlyNumbers.length === 11) return onlyNumbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  return onlyNumbers;
};

export { ko };
