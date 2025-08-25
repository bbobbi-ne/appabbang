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

const EMAIL = {
  min: { value: 1, message: '이메일은 1자 이상 입력 바랍니다.' },
  max: { value: 50, message: '이메일은 50자 이내로 입력 바랍니다.' },
  regex: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    message: '유효한 이메일 형식이 아닙니다.',
  },
  required: { message: '이메일을 입력하세요.' },
};

const PASSWORD = {
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

export const findPwSchema = z.object({
  id: z
    .string({ required_error: ID_VALIDATION.required.message })
    .trim()
    .min(ID_VALIDATION.min.value, ID_VALIDATION.min.message)
    .max(ID_VALIDATION.max.value, ID_VALIDATION.max.message)
    .regex(ID_VALIDATION.regex.value, { message: ID_VALIDATION.regex.message }),

  email: z
    .string({ required_error: EMAIL.required.message })
    .trim()
    .min(EMAIL.min.value, EMAIL.min.message)
    .max(EMAIL.max.value, EMAIL.max.message)
    .regex(EMAIL.regex.value, { message: EMAIL.regex.message }),

  code: z.string().optional(),
});
export type FindPwSchema = z.infer<typeof findPwSchema>;

export const pwModifyFormSchema = z
  .object({
    pwModify: z // 새 비밀번호
      .string({ required_error: '새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(PASSWORD.min.value, { message: PASSWORD.min.message })
      .max(PASSWORD.max.value, { message: PASSWORD.max.message })
      .regex(PASSWORD.regex.value, { message: PASSWORD.regex.message }),
    pwConfirm: z // 비밀번호 확인
      .string({ required_error: '확인을 위한 새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(PASSWORD.min.value, { message: PASSWORD.min.message })
      .max(PASSWORD.max.value, { message: PASSWORD.max.message })
      .regex(PASSWORD.regex.value, { message: PASSWORD.regex.message }),
  })
  .superRefine(({ pwModify, pwConfirm }, ctx) => {
    // 비밀번호 확인 :: 틀리면 오류
    if (pwModify !== pwConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pwConfirm'],
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
  });

export type pwModifyFormSchema = z.infer<typeof pwModifyFormSchema>;
