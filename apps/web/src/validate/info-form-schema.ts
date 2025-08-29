/**
 * 내 정보수정 유효성 검증
 */
import z from 'zod';

const ID_VALIDATION = {
  min: { value: 5, message: '아이디는 5자 이상 입력 바랍니다.' },
  max: { value: 30, message: '아이디는 30자 이내로 입력 바랍니다.' },
  regex: {
    // 영문 대/소문자 + 숫자 조합, 5~30자
    value: /^[a-zA-Z0-9]{5,30}$/,
    message: '아이디는 영문 대/소문자 + 숫자 조합으로 5~30자 입력 가능합니다.',
  },
  required: { message: '아이디를 입력하세요.' },
};

const NAME_VALIDATION = {
  min: { value: 2, message: '이름은 2자 이상 입력 바랍니다.' },
  max: { value: 30, message: '이름은 30자 이내로 입력 바랍니다.' },
  regex: {
    // 영문 대/소문자 + 숫자 조합, 5~30자
    value: /^[가-힣]{2,30}$/,
    message: '이름은 한글 2~30자 입력 가능합니다.',
  },
  required: { message: '이름을 입력하세요.' },
};

const EMAIL_VALIDATION = {
  min: { value: 1, message: '이메일은 1자 이상 입력 바랍니다.' },
  max: { value: 50, message: '이메일은 50자 이내로 입력 바랍니다.' },
  regex: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    message: '유효한 이메일 형식이 아닙니다.',
  },
  required: { message: '이메일을 입력하세요.' },
};

const MOBILE_NUMBER_VALIDATION = {
  regex: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
  required: { message: '휴대번호를 입력하세요.' },
};

export const customerFormSchema = z.object({
  id: z
    .string({ required_error: ID_VALIDATION.required.message })
    .trim()
    .min(ID_VALIDATION.min.value, ID_VALIDATION.min.message)
    .max(ID_VALIDATION.max.value, ID_VALIDATION.max.message)
    .regex(ID_VALIDATION.regex.value, { message: ID_VALIDATION.regex.message }),
  name: z
    .string({ required_error: NAME_VALIDATION.required.message })
    .trim()
    .min(NAME_VALIDATION.min.value, NAME_VALIDATION.min.message)
    .max(NAME_VALIDATION.max.value, NAME_VALIDATION.max.message)
    .regex(NAME_VALIDATION.regex.value, { message: NAME_VALIDATION.regex.message }),
  email: z
    .string({ required_error: EMAIL_VALIDATION.required.message })
    .trim()
    .min(EMAIL_VALIDATION.min.value, EMAIL_VALIDATION.min.message)
    .max(EMAIL_VALIDATION.max.value, EMAIL_VALIDATION.max.message)
    .regex(EMAIL_VALIDATION.regex.value, EMAIL_VALIDATION.regex.message),
  mobileNumber: z
    .string({ required_error: MOBILE_NUMBER_VALIDATION.required.message })
    .trim()
    .regex(MOBILE_NUMBER_VALIDATION.regex.value, {
      message: MOBILE_NUMBER_VALIDATION.regex.message,
    }),
  createdAt: z // 등록일시
    .string(),
  code: z.string().optional(),
});

export type CustomerFormSchema = z.infer<typeof customerFormSchema>;
