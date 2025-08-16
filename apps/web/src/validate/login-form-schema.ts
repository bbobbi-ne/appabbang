/**
 * 로그인 유효성 검증
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

export const loginSchema = z.object({
  id: z
    .string({ required_error: ID_VALIDATION.required.message })
    .trim()
    .min(ID_VALIDATION.min.value, ID_VALIDATION.min.message)
    .max(ID_VALIDATION.max.value, ID_VALIDATION.max.message)
    .regex(ID_VALIDATION.regex.value, { message: ID_VALIDATION.regex.message }),
  pw: z
    .string({ required_error: PASSWORD_VALIDATION.required.message })
    .trim()
    .min(PASSWORD_VALIDATION.min.value, PASSWORD_VALIDATION.min.message)
    .max(PASSWORD_VALIDATION.max.value, PASSWORD_VALIDATION.max.message)
    .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
  type: z.string(),
});

export type LoginFormType = z.infer<typeof loginSchema>;
