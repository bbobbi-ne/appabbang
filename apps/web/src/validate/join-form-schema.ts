/**
 * 회원가입 유효성 검증
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

const PASSWORD_VALIDATION = {
  min: { value: 10, message: '비밀번호는 10자 이상 입력 바랍니다.' },
  max: { value: 30, message: '비밀번호는 30자 이내로 입력 바랍니다.' },
  regex: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,30}$/g,
    message:
      '비밀번호는 영문 대소문자 + 숫자 + 특수문자 포함, 10~30자리, 공백 제외하여 입력 가능합니다.',
  },
  required: { message: '비밀번호를 입력하세요.' },
};

const MOBILE_NUMBER_VALIDATION = {
  regex: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
  required: { message: '휴대번호를 입력하세요.' },
};

const ADDRESS_VALIDATION = {
  min: { value: 1, message: '주소는 1자 이상 입력 바랍니다.' },
  max: { value: 300, message: '주소는 300자 이내로 입력 바랍니다.' },
  required: { message: '주소를 입력하세요.' },
};

const ADDRESS_DETAIL_VALIDATION = {
  min: { value: 1, message: '상세주소는 1자 이상 입력 바랍니다.' },
  max: { value: 200, message: '상세주소는 200자 이내로 입력 바랍니다.' },
  required: { message: '상세주소를 입력하세요.' },
};

const ZIPCODE_VALIDATION = {
  min: { value: 1, message: '우편번호는 1자 이상 입력 바랍니다.' },
  max: { value: 10, message: '우편번호는는 10자 이내로 입력 바랍니다.' },
  required: { message: '우편번호를 입력하세요.' },
};

// 스키마
export const joinSchema = z
  .object({
    id: z
      .string({ required_error: ID_VALIDATION.required.message })
      .trim()
      .min(ID_VALIDATION.min.value, ID_VALIDATION.min.message)
      .max(ID_VALIDATION.max.value, ID_VALIDATION.max.message)
      .regex(ID_VALIDATION.regex.value, { message: ID_VALIDATION.regex.message }),
    password: z
      .string({ required_error: PASSWORD_VALIDATION.required.message })
      .trim()
      .min(PASSWORD_VALIDATION.min.value, PASSWORD_VALIDATION.min.message)
      .max(PASSWORD_VALIDATION.max.value, PASSWORD_VALIDATION.max.message)
      .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
    passwordConfirm: z
      .string({ required_error: PASSWORD_VALIDATION.required.message })
      .trim()
      .min(PASSWORD_VALIDATION.min.value, PASSWORD_VALIDATION.min.message)
      .max(PASSWORD_VALIDATION.max.value, PASSWORD_VALIDATION.max.message)
      .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
    mobileNumber: z
      .string({ required_error: MOBILE_NUMBER_VALIDATION.required.message })
      .trim()
      .regex(MOBILE_NUMBER_VALIDATION.regex.value, {
        message: MOBILE_NUMBER_VALIDATION.regex.message,
      }),
    address: z
      .string({ required_error: ADDRESS_VALIDATION.required.message })
      .trim()
      .min(ADDRESS_VALIDATION.min.value, ADDRESS_VALIDATION.min.message)
      .max(ADDRESS_VALIDATION.max.value, ADDRESS_VALIDATION.max.message),
    addressDetail: z
      .string({ required_error: ADDRESS_DETAIL_VALIDATION.required.message })
      .trim()
      .min(ADDRESS_DETAIL_VALIDATION.min.value, ADDRESS_DETAIL_VALIDATION.min.message)
      .max(ADDRESS_DETAIL_VALIDATION.max.value, ADDRESS_DETAIL_VALIDATION.max.message),
    zipcode: z
      .string({ required_error: ZIPCODE_VALIDATION.required.message })
      .trim()
      .min(ZIPCODE_VALIDATION.min.value, ZIPCODE_VALIDATION.min.message)
      .max(ZIPCODE_VALIDATION.max.value, ZIPCODE_VALIDATION.max.message),
    isServiceTermsAgreed: z.boolean({
      required_error: '서비스 이용약관 처리방침을 확인 바랍니다.',
    }),
    isPrivacyTermsAgreed: z.boolean({
      required_error: '개인정보 수집 및 이용 처리방침을 확인 바랍니다.',
    }),
    isMarketingTermsAgreed: z.boolean({
      required_error: '마케팅 목적 개인정보 이용 및 광고 수신 동의 처리방침을 확인 바랍니다.',
    }),
    isAgree: z.boolean(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    // 비밀번호 확인 :: 틀리면 오류
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
  });

// 스키마 타입
export type JoinSchemaType = z.infer<typeof joinSchema>;
