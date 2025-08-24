import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
 * 🕒 Date 객체를 'yyyy-MM-dd HH시mm분ss초' 형식으로 변환
 * @param date Date 객체
 * @returns '2025-08-14 13시45분30초' 형태 문자열
 */
export function formatDateTime(date: Date): string {
  return format(date, 'yyyy년 MM월 dd일 HH시mm분ss초', { locale: ko });
}

/**
 * ⏱ 날짜(Date) + 시간 문자열 -> ISO 8601 문자열
 * @param date Date 객체
 * @param time 'HH:mm:ss' 형태 문자열
 * @returns '2025-08-14T13:45:30.000Z' ISO 문자열
 */
export function formatDateTimeToIso(date: Date): string {
  const isoString = date.toISOString();
  return isoString;
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
 * 연락처 하이픈 추가
 * @param value 전화번호형식의 문자열
 * @returns 숫자 길이에 따른 전화번호 형식의 문자열 예: 000-000-0000
 */
export const formatMobile = (value: string) => {
  // 입력값에서 숫자만 추출
  const onlyNumbers = value.replace(/\D/g, '');

  // 숫자 길이에 따라 전화번호 형식으로 변환
  let formattedValue = onlyNumbers;
  if (onlyNumbers.length === 10) {
    // 예: 000-000-0000
    formattedValue = onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (onlyNumbers.length === 11) {
    // 예: 000-0000-0000
    formattedValue = onlyNumbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 변환된 값
  return formattedValue;
};

export { ko };
