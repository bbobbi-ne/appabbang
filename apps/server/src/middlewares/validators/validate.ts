import { RequestHandler } from 'express';
import { validationResult, body, query, param } from 'express-validator';
import { AppError, CodeGroup } from '@/types';

export const validate = (validators: RequestHandler[]): RequestHandler => {
  return (req, res, next) => {
    (async () => {
      for (const validator of validators) {
        const maybePromise = validator(req, res, () => {});
        if (maybePromise instanceof Promise) {
          await maybePromise;
        }
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      throw AppError.badRequest(errors.array()[0]?.msg);
    })().catch(next);
  };
};

//AUTH//////////////////////////////////////////////////////////
export const loginValidator = [
  body('id').trim().notEmpty().withMessage('id 는 필수입니다'),
  body('pw').trim().notEmpty().withMessage('pw 는 필수입니다'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('type 는 필수입니다')
    .isIn(['user', 'customer'])
    .withMessage('유효한 타입이 아닙니다.'),
];

//BREAD//////////////////////////////////////////////////////////
export const getBreadsValidator = [
  query('breadStatus')
    .optional()
    .trim()
    .isIn(['10', '20', '30', '40', '50'])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
];

export const getBreadValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

export const createBreadValidator = [
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('allergyInfo').trim().notEmpty().withMessage('알레르기 정보는 필수입니다'),
  body('countryOfOrigin').trim().notEmpty().withMessage('원산지 정보는 필수입니다'),
  body('unitPrice')
    .trim()
    .notEmpty()
    .withMessage('가격은 필수입니다')
    .isFloat({ min: 0 })
    .withMessage('가격은 숫자여야 합니다')
    .toFloat(),
  body('breadStatus')
    .trim()
    .notEmpty()
    .isIn([10, 20, 30, 40, 50])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
];

export const updateBreadValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('allergyInfo').trim().notEmpty().withMessage('알레르기 정보는 필수입니다'),
  body('countryOfOrigin').trim().notEmpty().withMessage('원산지 정보는 필수입니다'),
  body('unitPrice')
    .trim()
    .notEmpty()
    .withMessage('가격은 필수입니다')
    .isFloat({ min: 0 })
    .withMessage('가격은 숫자여야 합니다')
    .toFloat(),
  body('breadStatus')
    .trim()
    .notEmpty()
    .isIn([10, 20, 30, 40, 50])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
];

export const updateBreadStatusValidator = [
  param('no').exists().withMessage('no는 필수입니다'),
  body('breadStatus')
    .trim()
    .notEmpty()
    .isIn([10, 20, 30, 40, 50])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
];

export const deleteBreadValidator = [
  body('noList')
    .exists()
    .withMessage('noList는 필수입니다')
    .isArray({ min: 1 })
    .withMessage('noList는 하나 이상의 요소를 가진 배열이어야 합니다.'),
  body('noList.*').isInt().toInt().withMessage('noList 안의 값은 정수여야 합니다.'),
];

export const deleteBreadImageValidator = [
  body('publicId')
    .exists()
    .withMessage('publicId는 필수입니다')
    .trim()
    .notEmpty()
    .withMessage('publicId는 비어있을 수 없습니다.'),
];

//COMMON CODE//////////////////////////////////////////////////////////
export const getCommonCodeListValidator = [
  param('groupName')
    .trim()
    .isIn(Object.values(CodeGroup))
    .withMessage(`유효한 그룹명이 아닙니다. (그룹명: ${Object.values(CodeGroup).join(', ')})`),
];

export const createCommonCodeValidator = [
  body('groupName')
    .isIn(Object.values(CodeGroup))
    .withMessage(`유효한 그룹명이 아닙니다. (그룹명: ${Object.values(CodeGroup).join(', ')})`),
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('code').trim().notEmpty().withMessage('코드는 필수입니다'),
];

export const updateCommonCodeValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('groupName')
    .isIn(Object.values(CodeGroup))
    .withMessage(`유효한 그룹명이 아닙니다. (그룹명: ${Object.values(CodeGroup).join(', ')})`),
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('code').trim().notEmpty().withMessage('코드는 필수입니다'),
];

export const deleteCommonCodeValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

//CUSTOMER//////////////////////////////////////////////////////////

export const getCustomerAddressesValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

export const getCustomerAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  param('addressNo')
    .exists()
    .withMessage('addressNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('addressNo 를 올바르게 입력해주세요.'),
];

export const createAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
];

export const updateAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  param('addressNo')
    .exists()
    .withMessage('addressNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('addressNo 를 올바르게 입력해주세요.'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
];

export const deleteAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  param('addressNo')
    .exists()
    .withMessage('addressNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('addressNo 를 올바르게 입력해주세요.'),
];

//DELIVERY METHOD//////////////////////////////////////////////////////////
export const getDeliveryMethodValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

export const createDeliveryMethodValidator = [
  body('deliveryTypeCode').trim().notEmpty().withMessage('deliveryTypeCode 필수입니다'),
  body('name').trim().notEmpty().withMessage('name은 필수입니다'),
  body('fee')
    .trim()
    .notEmpty()
    .withMessage('fee는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('fee는 정수여야 합니다.'),
  body('isActive')
    .trim()
    .notEmpty()
    .withMessage('isActive는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

export const updateDeliveryMethodValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('deliveryTypeCode').trim().notEmpty().withMessage('deliveryTypeCode는 필수입니다'),
  body('name').trim().notEmpty().withMessage('name은 필수입니다'),
  body('fee')
    .trim()
    .notEmpty()
    .withMessage('fee는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('fee는 정수여야 합니다.'),
  body('isActive')
    .trim()
    .notEmpty()
    .withMessage('isActive는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

export const deleteDeliveryMethodValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

//ORDER//////////////////////////////////////////////////////////
export const createOrderValidator = [
  body('ordererName').trim().notEmpty().withMessage('ordererName 필수입니다'),
  body('ordererMobile').trim().notEmpty().withMessage('ordererMobile는 필수입니다'),
  ////
  body('address').trim().optional(), // 옵셔널
  body('addressDetail').trim().optional(), // 옵셔널
  body('zipcode').trim().optional(), // 옵셔널
  body('recipientName').trim().optional(), // 옵셔널
  body('recipientMobile').trim().optional(), // 옵셔널
  body('message').trim().optional(),
  ////
  body('orderItems')
    .exists()
    .withMessage('orderItems는 필수입니다')
    .isArray({ min: 1 })
    .withMessage('orderItems는 하나 이상의 요소를 가진 배열이어야 합니다.'),
  body('orderItems.*.breadNo')
    .exists()
    .withMessage('breadNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('breadNo는 정수여야 합니다'),
  body('orderItems.*.quantity')
    .exists()
    .withMessage('quantity는 필수입니다')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('quantity는 1 이상의 숫자여야 합니다.'),
  ////
  body('deliveryTypeCode')
    .trim()
    .notEmpty()
    .withMessage('deliveryTypeCode는 필수입니다')
    .isIn(['10', '20'])
    .withMessage('유효한 배송 타입코드가 아닙니다. (10, 20)'),
  ////
  body('deliveryMethodNo')
    .trim()
    .notEmpty()
    .withMessage('deliveryMethodNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('deliveryMethodNo를 올바르게 입력해주세요.'),
  ////
  body('totalPrice')
    .trim()
    .notEmpty()
    .withMessage('totalPrice는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('totalPrice는 정수여야 합니다'),
  ////
  body('bankCode').trim().notEmpty().withMessage('bankCode는 필수입니다'),
  body('accountNumber').trim().notEmpty().withMessage('accountNumber는 필수입니다'),
  body('accountHolderName').trim().notEmpty().withMessage('accountHolderName는 필수입니다'),
  //// 쿠폰은 옵션
  body('customerCouponNo')
    .trim()
    .optional()
    .isInt()
    .toInt()
    .withMessage('customerCouponNo를 올바르게 입력해주세요.'),
  ////
  body('orderRoundNo')
    .trim()
    .notEmpty()
    .withMessage('orderRoundNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('orderRoundNo를 올바르게 입력해주세요.'),
  body('isPaymentRefundTermsAgreed')
    .trim()
    .notEmpty()
    .withMessage('isPaymentRefundTermsAgreed는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
  ////
  body('orderPw').trim().optional(), // 옵션
  body('isServiceTermsAgreed') // 옵션
    .trim()
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
  body('isPrivacyTermsAgreed') // 옵션
    .trim()
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

export const updateOrderValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('trackingNumber').trim().optional(),
];

export const updateOrderStatusValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('orderStatus')
    .trim()
    .notEmpty()
    .withMessage('orderStatus는 필수입니다')
    .isIn(['10', '11', '20', '30', '31', '40', '50', '51', '52'])
    .withMessage('유효한 상태여야 합니다 (10, 11, 20, 30, 31, 40, 50, 51,52)'),
];

export const updateOrderPaidValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('paid')
    .trim()
    .notEmpty()
    .withMessage('paid는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

export const deleteOrderValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

/** 배송지 상세 조회 validate */
export const getMyAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

/** 배송지 등록 validate */
export const createMyAddressValidator = [
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('message').trim().notEmpty().withMessage('message는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
  body('isDefault')
    .trim()
    .notEmpty()
    .withMessage('isDefault는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

/** 배송지 수정 validate */
export const updateMyAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('message').trim().notEmpty().withMessage('message는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
  body('isDefault')
    .trim()
    .notEmpty()
    .withMessage('isDefault는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
];

/** 주문 배송지 수정 validate */
export const updateOrderAddressValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('message').trim().notEmpty().withMessage('message는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
];

/** 쿠폰 생성 validate */
export const createCouponValidator = [
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('amount').trim().notEmpty().isInt().toInt().withMessage('할인금액은 필수입니다'),
  body('expireAfterDays').trim().notEmpty().isInt().toInt().withMessage('만료일자는 필수입니다'),
];

/** 쿠폰 수정 validate */
export const updateCouponValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('이름은 필수입니다')
    .isLength({ min: 1, max: 30 })
    .withMessage('이름은 1자 이상 30자 이하여야 합니다.'),
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('할인금액은 필수입니다')
    .isInt({ min: 100, max: 50000 })
    .toInt()
    .withMessage('할인금액은 100원 이상 50,000원 이하여야 합니다.'),
  body('expireAfterDays')
    .trim()
    .notEmpty()
    .withMessage('만료일자는 필수입니다')
    .isInt({ min: 1, max: 99999 })
    .toInt()
    .withMessage('만료일자는 1일 이상 99,999일 이하여야 합니다.'),
];

/** 쿠폰 삭제 validate */
export const deleteCouponValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

/** 쿠폰 발급 validate (쿠폰하나를 여러 고객에게 발급) */
export const issueCouponValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('noList')
    .exists()
    .withMessage('noList(고객번호 배열)는 필수입니다')
    .isArray({ min: 1 })
    .withMessage('noList는 하나 이상의 요소를 가진 배열이어야 합니다.'),
  body('noList.*').isInt().toInt().withMessage('noList 안의 값은 정수여야 합니다.'),
];

/** 파라미터 조회 validate */
export const paramsNoValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
];

/** 주문 취소 validate */
export const cancelOrderValidator = [
  param('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('canceledReason').trim().notEmpty().withMessage('canceledReason는 필수입니다'),
];

//// GUEST ////////////////////////////////////////////////////////////////////
/** 주문자 검증 */
const ORDERER = {
  key: 'orderer',
  length: { min: 2, max: 20, message: '주문자는 2~30자 내로 입력해야 합니다.' },
  matches: {
    value: /^[가-힣]{2,30}$/,
    message: '주문자는 한글 2~30자 입력 가능합니다.',
  },
  string: { message: '주문자는 문자열로 입력해야 합니다.' },
};

const MOBILE_NUMBER = {
  key: 'mobileNumber',
  matches: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
  string: { message: '휴대번호는 문자열로 입력해야 합니다.' },
};

const ORDER_PW = {
  key: 'orderPw',
  length: { min: 4, max: 20, message: '주문 비밀번호는 4~20자 이내로 입력 바랍니다.' },
  string: { message: '주문 비밀번호는 문자열로 입력해야 합니다.' },
};

const EMAIL = {
  key: 'email',
  length: { min: 1, max: 50, message: '이메일은 1~50자 이내 입력 바랍니다.' },
  matches: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g, message: '유효한 이메일 형식이 아닙니다.' },
  string: { message: '이메일은 문자열로 입력 바랍니다.' },
};

/** 비회원 로그인 */
export const loginGuestValidator = [
  body(ORDERER.key)
    .notEmpty()
    .matches(ORDERER.matches.value)
    .withMessage(ORDERER.matches.message)
    .isString()
    .withMessage(ORDERER.string.message)
    .isLength({ min: ORDERER.length.min, max: ORDERER.length.max })
    .withMessage(ORDERER.length.message)
    .trim(),

  body(MOBILE_NUMBER.key)
    .notEmpty()
    .matches(MOBILE_NUMBER.matches.value)
    .withMessage(MOBILE_NUMBER.matches.message)
    .isString()
    .withMessage(MOBILE_NUMBER.string.message)
    .trim(),

  body(EMAIL.key)
    .notEmpty()
    .isString()
    .withMessage(EMAIL.string.message)
    .isLength({ min: EMAIL.length.min, max: EMAIL.length.max })
    .withMessage(EMAIL.length.message)
    .trim(),

  body(ORDER_PW.key)
    .notEmpty()
    .isString()
    .withMessage(ORDER_PW.string.message)
    .isLength({ min: ORDER_PW.length.min, max: ORDER_PW.length.max })
    .withMessage(ORDER_PW.length.message)
    .trim(),
];

////////////////////////////////////////////////////////////////////////
