/**
 * 배송지 변경 유효성 검증
 */

import z from 'zod';

const RECIPIENTNAME_VALIDATION = {
  min: { value: 2, message: '수령인은 최소 2자 이상 입력 바랍니다.' },
  max: { value: 30, message: '수령인은 30자 이내로 입력 바랍니다.' },
  regex: {
    // 영문 대/소문자 + 숫자 조합, 5~30자
    value: /^[가-힣]{2,30}$/,
    message: '수령인은 한글 2~30자 입력 가능합니다.',
  },
  required: { message: '수령인을 입력하세요.' },
};

const RECIPIENTMOBILE_VALIDATION = {
  min: { value: 10, message: '수령인 휴대번호는 최소 10자 이상 입력 바랍니다.' },
  regex: {
    value: /^01[016789]-?\d{3,4}-?\d{4}$/g,
    message: '유효한 휴대번호 양식이 아닙니다.',
  },
  required: { message: '수령인 휴대번호를 입력하세요.' },
};

const ADDRESS_VALIDATION = {
  min: { value: 1, message: '주소는 최소 1자 이상 입력 바랍니다.' },
  max: { value: 300, message: '주소는 300자 이내로 입력 바랍니다.' },
  required: { message: '주소를 입력하세요.' },
};

const ADDRESSDETAIL_VALIDATION = {
  min: { value: 1, message: '상세주소는 최소 1자 이상 입력 바랍니다.' },
  max: { value: 300, message: '상세주소는 200자 이내로 입력 바랍니다.' },
  required: { message: '상세주소를 입력하세요.' },
};

const ZIPCODE_VALIDATION = {
  min: { value: 1, message: '우편번호는 1자 이상 입력 바랍니다.' },
  max: { value: 10, message: '우편번호는는 10자 이내로 입력 바랍니다.' },
  required: { message: '우편번호를 입력하세요.' },
};

const MESSAGE_VALIDATION = {
  min: { value: 1, message: '배송메세지는 1자 이상 입력 바랍니다.' },
  max: { value: 30, message: '배송메세지는 30자 이내로 입력 바랍니다.' },
  required: { message: '배송메세지를 입력하세요.' },
};

export const addressSchema = z.object({
  recipientName: z
    .string({ required_error: RECIPIENTNAME_VALIDATION.required.message })
    .trim()
    .min(RECIPIENTNAME_VALIDATION.min.value, RECIPIENTNAME_VALIDATION.min.message)
    .max(RECIPIENTNAME_VALIDATION.max.value, RECIPIENTNAME_VALIDATION.max.message)
    .regex(RECIPIENTNAME_VALIDATION.regex.value, {
      message: RECIPIENTNAME_VALIDATION.regex.message,
    }),

  recipientMobile: z
    .string({ required_error: RECIPIENTMOBILE_VALIDATION.required.message })
    .trim()
    .min(RECIPIENTMOBILE_VALIDATION.min.value, RECIPIENTMOBILE_VALIDATION.min.message)
    .regex(RECIPIENTMOBILE_VALIDATION.regex.value, {
      message: RECIPIENTMOBILE_VALIDATION.regex.message,
    }),

  address: z
    .string({ required_error: ADDRESS_VALIDATION.required.message })
    .trim()
    .min(ADDRESS_VALIDATION.min.value, ADDRESS_VALIDATION.min.message)
    .max(ADDRESS_VALIDATION.max.value, ADDRESS_VALIDATION.max.message),

  addressDetail: z
    .string({ required_error: ADDRESSDETAIL_VALIDATION.required.message })
    .trim()
    .min(ADDRESSDETAIL_VALIDATION.min.value, ADDRESSDETAIL_VALIDATION.min.message)
    .max(ADDRESSDETAIL_VALIDATION.max.value, ADDRESSDETAIL_VALIDATION.max.message),

  zipcode: z
    .string({ required_error: ZIPCODE_VALIDATION.required.message })
    .trim()
    .min(ZIPCODE_VALIDATION.min.value, ZIPCODE_VALIDATION.min.message)
    .max(ZIPCODE_VALIDATION.max.value, ZIPCODE_VALIDATION.max.message),

  message: z
    .string({ required_error: MESSAGE_VALIDATION.required.message })
    .trim()
    .min(MESSAGE_VALIDATION.min.value, MESSAGE_VALIDATION.min.message)
    .max(MESSAGE_VALIDATION.max.value, MESSAGE_VALIDATION.max.message),

  isDefault: z.boolean().optional(),
  no: z.number().optional(),
});
export type addresssDailogForm = z.infer<typeof addressSchema>;
