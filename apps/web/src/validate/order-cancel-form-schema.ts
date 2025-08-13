/**
 * 주문 취소
 */
import z from 'zod';

export const orderCancelFormSchema = z.object({
  canceledReason: z // 취소사유
    .string({ required_error: '취소사유를 입력 바랍니다.' })
    .trim()
    .min(5, { message: '취소사유는 최소 5자 이상 작성해야 합니다.' })
    .max(300, { message: '취소사유는 최대 300자 이내로 작성해야 합니다.' }),
});

export type OrderCancelFormSchema = z.infer<typeof orderCancelFormSchema>;
