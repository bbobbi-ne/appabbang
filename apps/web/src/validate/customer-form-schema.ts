/**
 * 내 정보수정 유효성 검증
 */
import z from 'zod';

const minNum = 1;
const minMsg = `최소 ${minNum}자 이상부터 입력할 수 있습니다.`;
const maxNum = 5;
const maxMsg = `최대 ${maxNum}자까지 입력할 수 있습니다.`;
const regExpMsg = `한글 1글자 이상 입력할 수 있습니다.`;

export const customerFormSchema = z.object({
  name: z // 고객 이름
    .string({
      required_error: '이름을 입력 바랍니다.',
    })
    .min(minNum, { message: `이름은 ${minMsg}` })
    .max(5, { message: `이름은 ${maxMsg}` })
    .regex(/^[가-힣+$]/, { message: `이름은 ${regExpMsg}` }),
  id: z // 아이디
    .string({
      required_error: '아이디를 입력 바랍니다.',
    })
    .trim()
    .min(5, '아이디는 최소 5자 이상 입력 바랍니다.')
    .max(15, '아이디는 최대 15자 이내로 입력 바랍니다.')
    .regex(/^[A-Za-z0-9]{5,15}$/, {
      message: '아이디는 영문 대소문자 최소 5~15글자 입력해야 합니다.',
    }),
  mobileNumber: z // 전화번호
    .string({ required_error: '전화번호를 입력 바랍니다.' })
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, { message: '유효한 휴대번호 양식이 아닙니다.' }),
  createdAt: z // 등록일시
    .string(),
});

export type CustomerFormSchema = z.infer<typeof customerFormSchema>;
