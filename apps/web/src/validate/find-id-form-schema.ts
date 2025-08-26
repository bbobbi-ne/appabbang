import type { UseFormReturn } from 'react-hook-form';
import z from 'zod';

const EMAIL = {
  min: { value: 1, message: '이메일은 1자 이상 입력 바랍니다.' },
  max: { value: 50, message: '이메일은 50자 이내로 입력 바랍니다.' },
  regex: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    message: '유효한 이메일 형식이 아닙니다.',
  },
  required: { message: '이메일을 입력하세요.' },
};

export const findIdSchema = z.object({
  email: z
    .string({ required_error: EMAIL.required.message })
    .trim()
    .min(EMAIL.min.value, EMAIL.min.message)
    .max(EMAIL.max.value, EMAIL.max.message)
    .regex(EMAIL.regex.value, { message: EMAIL.regex.message }),

  code: z.string().optional(),
});
export type FindIdSchema = z.infer<typeof findIdSchema>;

/** '이메일'만 유효성 검증 */
export const findIdValidEmail = (email: string, form: UseFormReturn<FindIdSchema>) => {
  if (!email) {
    form.setError('email', { type: 'required', message: '이메일을 입력해주세요.' });
    return false;
  }

  const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
  if (!regexp.test(email)) {
    form.setError('email', { type: 'regex', message: '유효한 이메일 형식이 아닙니다.' });
    return false;
  }

  return true;
};
