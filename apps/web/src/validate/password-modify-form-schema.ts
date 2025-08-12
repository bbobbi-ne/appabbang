/**
 * 비밀번호 변경 유효성 검증
 */
import z from 'zod';

const PASSWORD_VALIDATION = {
  min: {
    value: 10,
    message: '비밀번호는 10자 이상 입력 바랍니다.',
  },
  max: {
    value: 30,
    message: '비밀번호는 30자 이내로 입력 바랍니다.',
  },
  regex: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,30}$/g,
    message:
      '비밀번호는 영문 대소문자 + 숫자 + 특수문자 포함, 10~30자리, 공백 제외하여 입력 가능합니다.',
  },
  required: {
    message: '비밀번호를 입력하세요.',
  },
};

export const passwordModifyFormSchema = z
  .object({
    password: z // 현재 비밀번호
      .string({ required_error: '현재 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(PASSWORD_VALIDATION.min.value, { message: PASSWORD_VALIDATION.min.message })
      .max(PASSWORD_VALIDATION.max.value, { message: PASSWORD_VALIDATION.max.message })
      .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
    passwordModify: z // 새 비밀번호
      .string({ required_error: '새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(PASSWORD_VALIDATION.min.value, { message: PASSWORD_VALIDATION.min.message })
      .max(PASSWORD_VALIDATION.max.value, { message: PASSWORD_VALIDATION.max.message })
      .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
    passwordConfirm: z // 비밀번호 확인
      .string({ required_error: '확인을 위한 새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(PASSWORD_VALIDATION.min.value, { message: PASSWORD_VALIDATION.min.message })
      .max(PASSWORD_VALIDATION.max.value, { message: PASSWORD_VALIDATION.max.message })
      .regex(PASSWORD_VALIDATION.regex.value, { message: PASSWORD_VALIDATION.regex.message }),
  })
  .superRefine(({ password, passwordModify }, ctx) => {
    // 비밀번호 확인 :: 틀리면 오류
    if (password !== passwordModify) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
  });

export type PasswordModifyFormSchema = z.infer<typeof passwordModifyFormSchema>;
