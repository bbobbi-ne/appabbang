import { z } from 'zod';

const minNum = 1;
const minMsg = `최소 ${minNum}자 이상부터 입력할 수 있습니다.`;
const maxNum = 5;
const maxMsg = `최대 ${maxNum}자까지 입력할 수 있습니다.`;
const regExpMsg = `한글 1글자 이상 입력할 수 있습니다.`;
const addrMax = 100;
const addrMaxMsg = `최대 ${addrMax}자까지 입력할 수 있습니다.`;

export const formSchema = z.object({
  name: z // 주문자
    .string({
      required_error: '주문자명을 입력 바랍니다.',
    })
    .min(minNum, { message: `주문자명은 ${minMsg}` })
    .max(5, { message: `주문자명은 ${maxMsg}` })
    .regex(/^[가-힣+$]/, { message: `주문자명은 ${regExpMsg}` }),
  mobileNumber: z // 주문자 전화번호
    .string({ required_error: '주문자 전화번호를 입력 바랍니다.' })
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, { message: '유효한 휴대번호 양식이 아닙니다.' }),
  recipientName: z // 수령인
    .string({ required_error: '수령인을 입력 바랍니다.' })
    .min(minNum, { message: `수령인은 ${minMsg}` })
    .max(maxNum, { message: `수령인은 ${maxMsg}` })
    .regex(/^[가-힣+$]/, { message: `수령인은 ${regExpMsg}` }),
  recipientMobile: z // 수령인 전화번호
    .string({ required_error: '수령인 전화번호를 입력 바랍니다.' })
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, { message: '유효한 휴대번호 양식이 아닙니다.' }),
  deliveryMethodNo: z // 배송타입
    .string({ required_error: '배송타입을 선택 바랍니다.' }),
  address: z // 배송지 주소
    .string({ required_error: '배송지 주소를 입력 바랍니다.' })
    .min(minNum, { message: `배송지 주소는 ${minMsg}` })
    .max(addrMax, { message: `배송지 주소는 ${addrMaxMsg}` }),
  addressDetail: z // 배송지 상세주소
    .string({ required_error: '배송지 상세주소를 입력 바랍니다.' })
    .min(minNum, { message: `배송지 상세주소는 ${minMsg}` })
    .max(addrMax, { message: `배송지 상세주소는 ${addrMaxMsg}` }),
  zipcode: z // 우편번호
    .string(),
  invoiceNum: z // 송장번호
    .string({ required_error: '송장번호를 입력 바랍니다.' })
    .min(minNum, { message: `송장번호는 ${minMsg}` }),
});

export type FormSchema = z.infer<typeof formSchema>;
