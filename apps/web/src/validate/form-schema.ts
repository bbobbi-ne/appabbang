import { z } from 'zod';

const minNum = 1;
const minMsg = `최소 ${minNum}자 이상부터 입력할 수 있습니다.`;
const maxNum = 5;
const maxMsg = `최대 ${maxNum}자까지 입력할 수 있습니다.`;
const regExpMsg = `한글 1글자 이상 입력할 수 있습니다.`;
const addrMax = 100;
const addrMaxMsg = `최대 ${addrMax}자까지 입력할 수 있습니다.`;

/**
 * 주문서 유효성 검증
 */
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
    .string({ required_error: '배송방법을 선택 바랍니다.' }),
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
  message: z // 배송메세지
    .string()
    .max(200, { message: '배송메세지는 200자 이내로 입력 바랍니다.' }),
  orderItems: z // 주문목록
    .array(
      z.object({
        breadNo: z.number({ required_error: '빵 번호가 필요합니다.' }),
        quantity: z
          .number({ required_error: '수량이 필요합니다.' })
          .min(1, { message: '수량은 최소 1개 이상이어야 합니다.' }),
      }),
    )
    .min(1, { message: '주문목록은 최소 1개 이상이어야 합니다.' }),
  orderPw: z // 주문 비밀번호
    .string({ required_error: '주문 비밀번호를 입력 바랍니다.' })
    .min(4, { message: '주문 비밀번호는 최소 4자 이상이어야 합니다.' })
    .max(20, { message: '주문 비밀번호는 최대 20자입니다.' }),
  totalPrice: z // 최종금액
    .number(),
  discountAmount: z // 할인금액
    .number(),
  agreed: z // 동의여부(화면에서만 사용)
    .boolean(),
  bankCode: z // 은행코드
    .string({ required_error: '은행을 선택 바랍니다.' }),
  accountNumber: z // 계좌번호
    .string({ required_error: '계좌번호를 입력 바랍니다.' }),
  accountHolderName: z // 예금주
    .string({ required_error: '예금주명을 입력 바랍니다.' })
    .min(minNum, { message: `예금주명은 ${minMsg}` })
    .max(20, { message: `예금주명은 최대 20자까지 입력할 수 있습니다.` })
    .regex(/^[가-힣A-Z_(),]{1,20}$/, {
      message: `예금주명은 영문+한글+특수문자 사용이 가능합니다. (특수문자: (, ), _`,
    }),
  same: z // 주문자-수령인 동일여부
    .boolean(),
});

export type FormSchema = z.infer<typeof formSchema>;

/**
 * 내 정보수정 유효성 검증
 */
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

/**
 * 비밀번호 변경 유효성 검증
 */
const PASSWORD_VALIDATION = {
  min: {
    value: 10,
    message: '비밀번호는 10자 이상입니다.',
  },
  max: {
    value: 30,
    message: '비밀번호는 30자 이내로 작성 바랍니다.',
  },
  regex: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,20}$/g,
    message:
      '비밀번호는 영문 대소문자 + 숫자 + 특수문자 포함, 10~20자리, 공백 제외하여 입력 가능합니다.',
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
