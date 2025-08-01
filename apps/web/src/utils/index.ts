/** 연락처 하이픈 추가  */
export const getFormattedMobile = (value: string) => {
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
