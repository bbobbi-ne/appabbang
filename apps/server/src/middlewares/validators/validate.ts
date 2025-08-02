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
  body('deliveryType').trim().notEmpty().withMessage('deliveryType는 필수입니다'),
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
  body('deliveryType').trim().notEmpty().withMessage('deliveryType는 필수입니다'),
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
  body('name').trim().notEmpty().withMessage('name은 필수입니다'),
  body('mobileNumber').trim().notEmpty().withMessage('mobileNumber는 필수입니다'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
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
  body('deliveryMethodNo')
    .trim()
    .notEmpty()
    .withMessage('deliveryMethodNo는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('deliveryMethodNo를 올바르게 입력해주세요.'),
  body('totalPrice')
    .trim()
    .notEmpty()
    .withMessage('totalPrice는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('totalPrice는 정수여야 합니다'),
  body('discountAmount')
    .trim()
    .notEmpty()
    .withMessage('discountAmount는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('discountAmount는 정수여야 합니다'),
  body('bankCode').trim().notEmpty().withMessage('bankCode는 필수입니다'),
  body('accountNumber').trim().notEmpty().withMessage('accountNumber는 필수입니다'),
  body('accountHolderName').trim().notEmpty().withMessage('accountHolderName는 필수입니다'),
];

export const updateOrderValidator = [
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
    .isIn(['10', '20', '30', '40', '50'])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
  body('paid')
    .trim()
    .notEmpty()
    .withMessage('paid는 필수입니다')
    .isBoolean()
    .toBoolean()
    .withMessage('boolean 타입이어야 합니다.'),
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
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
    .isIn(['10', '20', '30', '40', '50'])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
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

/**
 * 주문차수 등록 validate
 */
export const createOrderRoundValidator = [
  body('seq')
    .trim()
    .notEmpty()
    .withMessage('주문차수는 필수 입력항목입니다.')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('주문차수는 정수로 입력해야 합니다.'),
  body('name').trim().notEmpty().withMessage('주문차수명은 필수 입력항목입니다.'),
  body('startedAt')
    .trim()
    .notEmpty()
    .withMessage('시작일자는 필수 입력항목입니다.')
    .isDate()
    .withMessage('시작일자는 날짜 형식이어야 합니다.'),
  body('endedAt')
    .trim()
    .notEmpty()
    .withMessage('종료일자는 필수 입력항목입니다.')
    .isDate()
    .withMessage('종료일자는 날짜 형식이어야 합니다.'),
];

/**
 * 주문차수 수정 validate
 */
export const updateOrderRoundValidator = [
  param('no')
    .exists()
    .withMessage('주문차수No는 필수 입력항목입니다.')
    .isInt()
    .toInt()
    .withMessage('no 를 올바르게 입력해주세요.'),
  body('name').trim().notEmpty().withMessage('주문차수명은 필수 입력항목입니다.'),
  body('startedAt')
    .trim()
    .notEmpty()
    .withMessage('시작일자는 필수 입력항목입니다.')
    .isDate()
    .withMessage('시작일자는 날짜 형식이어야 합니다.'),
  body('endedAt')
    .trim()
    .notEmpty()
    .withMessage('종료일자는 필수 입력항목입니다.')
    .isDate()
    .withMessage('종료일자는 날짜 형식이어야 합니다.'),
];

/**
 * 주문차수 삭제 validate
 */
export const deleteOrderRoundImageValidator = [
  body('publicId')
    .exists()
    .withMessage('이미지 ID값이 누락되었습니다. (publicId)')
    .trim()
    .notEmpty()
    .withMessage('이미지 ID는 비어있을 수 없습니다.'),
];
