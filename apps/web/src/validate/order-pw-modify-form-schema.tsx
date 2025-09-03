/**
 * 비밀번호 변경 유효성 검증
 */
import z from 'zod';

export const ORDER_PW = {
  min: { value: 4, message: '주문 비밀번호는 4자 이상 입력 바랍니다.' },
  max: { value: 30, message: '주문 비밀번호는 30자 이내로 입력 바랍니다.' },
  // 정규표현식 사용안함. 주문 비밀번호를 잊어서 임시 비밀번호를 발급받을 수 있으므로 유연한 값을 받아야 함.
  // ex1. 1234 (주문등록 시 직접입력)
  // ex2. 7g}dOIu>Qc6 (임시 비밀번호)
  required: { message: '비밀번호를 입력하세요.' },
};

export const UpdateGuestOrderPwFormSchema = z
  .object({
    orderPw: z // 현재 비밀번호
      .string({ required_error: '현재 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(ORDER_PW.min.value, { message: ORDER_PW.min.message })
      .max(ORDER_PW.max.value, { message: ORDER_PW.max.message }),
    orderPwModify: z // 새 비밀번호
      .string({ required_error: '새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(ORDER_PW.min.value, { message: ORDER_PW.min.message })
      .max(ORDER_PW.max.value, { message: ORDER_PW.max.message }),
    orderPwConfirm: z // 비밀번호 확인
      .string({ required_error: '확인을 위한 새 비밀번호를 입력 바랍니다.' })
      .trim()
      .min(ORDER_PW.min.value, { message: ORDER_PW.min.message })
      .max(ORDER_PW.max.value, { message: ORDER_PW.max.message }),
  })
  .superRefine(({ orderPwModify, orderPwConfirm }, ctx) => {
    // 비밀번호 확인 :: 틀리면 오류
    if (orderPwModify !== orderPwConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pwConfirm'],
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
  });

export type UpdateGuestOrderPwFormType = z.infer<typeof UpdateGuestOrderPwFormSchema>;
