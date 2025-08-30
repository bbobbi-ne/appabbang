/**
 * 비회원 로그인 유효성 검증
 */
import z from 'zod';

/** 주문자 */
const ORDERER = {
  min: { value: 2, message: '주문자는 2자 이상 입력 바랍니다.' },
  max: { value: 30, message: '주문자는 30자 이내로 입력 바랍니다.' },
  regex: {
    // 한글 + 숫자 조합, 2~30자
    value: /^[가-힣]{2,30}$/,
    message: '주문자는 한글 2~30자 입력 가능합니다.',
  },
  required: { message: '주문자를 입력하세요.' },
};

const MOBILE_NUMBER = {
  regex: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
  required: { message: '휴대번호를 입력하세요.' },
};

const ORDER_PW = {
  min: { value: 4, message: '주문 비밀번호를 4자 이상 입력해주세요.' },
  max: { value: 20, message: '주문 비밀번호를 20자 이하로 입력해주세요.' },
  required: { message: '주문 비밀번호를 입력해주세요.' },
};

const EMAIL = {
  min: { value: 1, message: '이메일은 1자 이상 입력 바랍니다.' },
  max: { value: 50, message: '이메일은 50자 이내로 입력 바랍니다.' },
  regex: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    message: '유효한 이메일 형식이 아닙니다.',
  },
  required: { message: '이메일을 입력하세요.' },
};

export const loginGuestSchema = z.object({
  // 주문자
  orderer: z
    .string({ required_error: ORDERER.required.message })
    .trim()
    .min(ORDERER.min.value, ORDERER.min.message)
    .max(ORDERER.max.value, ORDERER.max.message)
    .regex(ORDERER.regex.value, { message: ORDERER.regex.message }),
  // 휴대번호
  mobileNumber: z
    .string({ required_error: MOBILE_NUMBER.required.message })
    .trim()
    .regex(MOBILE_NUMBER.regex.value, {
      message: MOBILE_NUMBER.regex.message,
    }),
  // 이메일
  email: z
    .string({ required_error: EMAIL.required.message })
    .trim()
    .min(EMAIL.min.value, EMAIL.min.message)
    .max(EMAIL.max.value, EMAIL.max.message)
    .regex(EMAIL.regex.value, EMAIL.regex.message),
  // 주문 비밀번호
  orderPw: z
    .string({ required_error: ORDER_PW.required.message })
    .trim()
    .min(ORDER_PW.min.value, ORDER_PW.min.message)
    .max(ORDER_PW.max.value, ORDER_PW.max.message),
});

export type LoginGuestFormType = z.infer<typeof loginGuestSchema>;
