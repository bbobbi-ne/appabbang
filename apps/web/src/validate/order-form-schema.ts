import { z } from 'zod';

/** 주문자/수령인 이름 */
const createNameValidation = (type: string) => {
  const title = type.includes('orderer')
    ? '주문자'
    : type.includes('recipient')
      ? '수령인'
      : '예금주';

  return {
    min: { value: 2, message: `${title} 이름은 2자 이상 입력 바랍니다.` },
    max: { value: 30, message: `${title} 이름은 30자 이내로 입력 바랍니다.` },
    regex: {
      value: /^[가-힣]{2,30}$/,
      message: `${title} 이름은 한글 2~30자 입력 가능합니다.`,
    },
    required: { message: `${title} 이름을 입력하세요.` },
  };
};
const ORDERER = createNameValidation('orderer');
const RECIPIENT = createNameValidation('recipient');
const HOLDER = createNameValidation('account');

/** 주문자/수령인 휴대번호 */
const createMobileNumberValidation = (type: string) => {
  const title = type.includes('orderer') ? '주문자' : '수령인';

  return {
    regex: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
    required: { message: `${title} 휴대번호를 입력하세요.` },
  };
};
const ORDERER_MOBILE = createMobileNumberValidation('orderer');
const RECIPIENT_MOBILE = createMobileNumberValidation('recipient');

/** 주문자/수령인 휴대번호 */
const createAddressValidation = (type: string) => {
  const title = type.includes('detail') ? '배송지 상세주소' : '배송지 주소';

  return {
    min: { value: 1, message: `${title}는 1자 이상 입력 바랍니다.` },
    max: { value: 300, message: `${title}는 300자 이내로 입력 바랍니다.` },
    required: { message: `${title}를 입력하세요.` },
  };
};
const ADDRESS = createAddressValidation('address');
const ADDRESS_DTL = createAddressValidation('detail');

const ZIPCODE = {
  min: { value: 1, message: '우편번호는 1자 이상 입력 바랍니다.' },
  max: { value: 10, message: '우편번호는 10자 이내로 입력 바랍니다.' },
  required: { message: '우편번호를 입력하세요.' },
};

const ORDER_ITEMS = {
  items: {
    min: { value: 1, message: '주문목록은 1개 이상이어야 합니다.' },
    required: { message: '빵을 선택하세요.' },
  },
  quantity: {
    min: { value: 1, message: '수량은 1개 이상이어야 합니다.' },
    max: { value: 999, message: '수량은 999개 이하여야 합니다.' },
    required: { message: '수량을 입력하세요.' },
  },
};

const ORDER_PW = {
  min: { value: 4, message: '주문 비밀번호는 4자 이상 입력 바랍니다.' },
  max: { value: 20, message: '주문 비밀번호는 20자 이하 입력 바랍니다.' },
  required: { message: '주문 비밀번호를 입력 바랍니다.' },
};

/**
 * 비회원 주문서 유효성 검증
 */
export const formSchema = z.object({
  ordererName: z // 주문자
    .string({ required_error: ORDERER.required.message })
    .trim()
    .min(ORDERER.min.value, ORDERER.min.message)
    .max(ORDERER.max.value, ORDERER.max.message)
    .regex(ORDERER.regex.value, ORDERER.regex.message),

  ordererMobile: z // 주문자 전화번호
    .string({ required_error: ORDERER_MOBILE.required.message })
    .trim()
    .regex(ORDERER_MOBILE.regex.value, ORDERER_MOBILE.regex.message),

  recipientName: z // 수령인
    .string({ required_error: RECIPIENT.required.message })
    .trim()
    .min(RECIPIENT.min.value, RECIPIENT.min.message)
    .max(RECIPIENT.max.value, RECIPIENT.max.message)
    .regex(RECIPIENT.regex.value, RECIPIENT.regex.message),

  recipientMobile: z // 수령인 전화번호
    .string({ required_error: RECIPIENT_MOBILE.required.message })
    .trim()
    .regex(RECIPIENT_MOBILE.regex.value, RECIPIENT_MOBILE.regex.message),

  deliveryMethodNo: z // 배송타입
    .string({ required_error: '배송방법을 선택 바랍니다.' })
    .trim(),

  address: z // 배송지 주소
    .string({ required_error: ADDRESS.required.message })
    .trim()
    .min(ADDRESS.min.value, ADDRESS.min.message)
    .max(ADDRESS.max.value, ADDRESS.max.message),

  addressDetail: z // 배송지 상세주소
    .string({ required_error: ADDRESS_DTL.required.message })
    .trim()
    .min(ADDRESS_DTL.min.value, ADDRESS_DTL.min.message)
    .max(ADDRESS_DTL.max.value, ADDRESS_DTL.max.message),

  zipcode: z // 우편번호
    .string({ required_error: ZIPCODE.required.message })
    .trim()
    .min(ZIPCODE.min.value, ZIPCODE.min.message)
    .max(ZIPCODE.max.value, ZIPCODE.max.message),

  message: z // 배송메세지
    .string()
    .trim()
    .optional(),

  orderItems: z // 주문목록
    .array(
      z.object({
        breadNo: z.number({ required_error: ORDER_ITEMS.items.required.message }),
        quantity: z
          .number()
          .min(ORDER_ITEMS.quantity.min.value, ORDER_ITEMS.quantity.min.message)
          .max(ORDER_ITEMS.quantity.max.value, ORDER_ITEMS.quantity.max.message),
      }),
    )
    .min(ORDER_ITEMS.items.min.value, ORDER_ITEMS.items.min.message),

  orderPw: z // 주문 비밀번호
    .string({ required_error: '주문 비밀번호를 입력 바랍니다.' })
    .trim()
    .min(ORDER_PW.min.value, ORDER_PW.min.message)
    .max(ORDER_PW.max.value, ORDER_PW.max.message),

  totalPrice: z // 최종금액
    .number(),

  discountAmount: z // 할인금액
    .number(),

  bankCode: z // 은행코드
    .string({ required_error: '은행을 선택 바랍니다.' }),

  accountNumber: z // 계좌번호
    .string({ required_error: '계좌번호를 입력 바랍니다.' }),

  accountHolderName: z // 예금주
    .string({ required_error: HOLDER.required.message })
    .trim()
    .min(HOLDER.min.value, HOLDER.min.message)
    .max(HOLDER.max.value, HOLDER.max.message)
    .regex(HOLDER.regex.value, HOLDER.required.message),

  same: z // 주문자-수령인 동일여부
    .boolean(),

  isServiceTermsAgreed: z.boolean({
    required_error: '서비스 이용약관 처리방침을 확인 바랍니다.',
  }),

  isPrivacyTermsAgreed: z.boolean({
    required_error: '개인정보 수집 및 이용 처리방침을 확인 바랍니다.',
  }),

  isPaymentRefundTermsAgreed: z.boolean(),

  orderRoundNo: z.number(),
});

export type FormSchema = z.infer<typeof formSchema>;

/**
 * 고객 주문서 form
 * */
export const customerOrderFormSchema = z.object({
  ordererName: z // 주문자
    .string({ required_error: ORDERER.required.message })
    .trim()
    .min(ORDERER.min.value, ORDERER.min.message)
    .max(ORDERER.max.value, ORDERER.max.message)
    .regex(ORDERER.regex.value, ORDERER.regex.message),

  ordererMobile: z // 주문자 전화번호
    .string({ required_error: ORDERER_MOBILE.required.message })
    .trim()
    .regex(ORDERER_MOBILE.regex.value, ORDERER_MOBILE.regex.message),

  recipientName: z // 수령인
    .string({ required_error: RECIPIENT.required.message })
    .trim()
    .min(RECIPIENT.min.value, RECIPIENT.min.message)
    .max(RECIPIENT.max.value, RECIPIENT.max.message)
    .regex(RECIPIENT.regex.value, RECIPIENT.regex.message),

  recipientMobile: z // 수령인 전화번호
    .string({ required_error: RECIPIENT_MOBILE.required.message })
    .trim()
    .regex(RECIPIENT_MOBILE.regex.value, RECIPIENT_MOBILE.regex.message),

  deliveryMethodNo: z // 배송타입
    .string({ required_error: '배송방법을 선택 바랍니다.' })
    .trim(),

  address: z // 배송지 주소
    .string({ required_error: ADDRESS.required.message })
    .trim()
    .min(ADDRESS.min.value, ADDRESS.min.message)
    .max(ADDRESS.max.value, ADDRESS.max.message),

  addressDetail: z // 배송지 상세주소
    .string({ required_error: ADDRESS_DTL.required.message })
    .trim()
    .min(ADDRESS_DTL.min.value, ADDRESS_DTL.min.message)
    .max(ADDRESS_DTL.max.value, ADDRESS_DTL.max.message),

  zipcode: z // 우편번호
    .string({ required_error: ZIPCODE.required.message })
    .trim()
    .min(ZIPCODE.min.value, ZIPCODE.min.message)
    .max(ZIPCODE.max.value, ZIPCODE.max.message),

  message: z // 배송메세지
    .string()
    .trim()
    .optional(),

  orderItems: z // 주문목록
    .array(
      z.object({
        breadNo: z.number({ required_error: ORDER_ITEMS.items.required.message }),
        quantity: z
          .number({ required_error: ORDER_ITEMS.quantity.required.message })
          .min(ORDER_ITEMS.quantity.min.value, ORDER_ITEMS.quantity.min.message)
          .max(ORDER_ITEMS.quantity.max.value, ORDER_ITEMS.quantity.max.message),
      }),
    )
    .min(ORDER_ITEMS.items.min.value, ORDER_ITEMS.items.min.message),

  totalPrice: z // 최종금액
    .number(),

  discountAmount: z // 할인금액
    .number(),

  bankCode: z // 은행코드
    .string({ required_error: '은행을 선택 바랍니다.' }),

  accountNumber: z // 계좌번호
    .string({ required_error: '계좌번호를 입력 바랍니다.' }),

  accountHolderName: z // 예금주
    .string({ required_error: HOLDER.required.message })
    .trim()
    .min(HOLDER.min.value, HOLDER.min.message)
    .max(HOLDER.max.value, HOLDER.max.message)
    .regex(HOLDER.regex.value, HOLDER.required.message),

  same: z // 주문자-수령인 동일여부
    .boolean()
    .optional(),

  isServiceTermsAgreed: z.boolean({
    required_error: '서비스 이용약관 처리방침을 확인 바랍니다.',
  }),

  isPrivacyTermsAgreed: z.boolean({
    required_error: '개인정보 수집 및 이용 처리방침을 확인 바랍니다.',
  }),

  isPaymentRefundTermsAgreed: z.boolean(),

  orderRoundNo: z.number(),
});
export type CustomerOrderFormSchema = z.infer<typeof customerOrderFormSchema>;
