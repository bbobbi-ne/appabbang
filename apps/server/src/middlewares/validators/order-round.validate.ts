/**
 * 주문차수 validate
 */
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

const ORDER_ROUND_NO_VALIDATION = {
  key: 'no',
  int: {
    min: 1,
    message: '주문차수 번호는 최소 1 이상이어야 합니다.',
  },
  empty: { message: '주문차수 번호는 필수 입력항목입니다.' },
};

const ORDER_ROUND_NAME_VALIDATION = {
  key: 'name',
  length: {
    min: 1,
    max: 30,
    message: '주문차수명은 1~30자 이내로 작성해야 합니다.',
  },
  string: { message: '주문차수명은 문자열로 입력해야 합니다.' },
  empty: { message: '주문차수명은 필수 입력항목입니다.' },
};

const ORDER_ROUND_ORDERROUNDBREADS_VALIDATION = {
  key: 'orderRoundBreads',
  array: {
    min: 1,
    message: '빵 목록은 최소 1개 이상 설정해야 합니다.',
  },
  string: { message: '빵 목록은 문자열로 입력해야 합니다.' },
  empty: { message: '빵 목록은 필수 입력항목입니다.' },
};

const ORDER_ROUND_STARTEDAT_VALIDATION = {
  key: 'startedAt',
  empty: { message: '시작일자는 필수 입력항목입니다.' },
  ISO8601: { message: '시작일자는 ISO8601 날짜형으로 입력해야 합니다.' },
};

const ORDER_ROUND_ENDEDAT_VALIDATION = {
  key: 'endedAt',
  empty: { message: '종료일자는 필수 입력항목입니다.' },
  ISO8601: { message: '종료일자는 ISO8601 날짜형으로 입력해야 합니다.' },
};

const PUBLICID_VALIDATION = {
  key: 'publicId',
  empty: { message: '이미지 공개ID는 필수 입력 항목입니다.' },
  string: { message: '이미지 공개ID는 문자열로 입력해야 합니다.' },
};

const ORDER_ROUND_MINORDERQTY_VALIDATION = {
  key: 'minOrderQty',
  empty: { message: '최소 주문 수량은 필수 입력항목입니다.' },
  isInt: { message: '최소 주문 수량은 숫자여야 합니다.' },
};

const ORDER_ROUND_MAXORDERQTY_VALIDATION = {
  key: 'maxOrderQty',
  empty: { message: '최대 주문 수량은 필수 입력항목입니다.' },
  isInt: { message: '최대 주문 수량은 숫자여야 합니다.' },
};

/**
 * 주문차수 등록 validate
 */
export const createOrderRoundValidator = [
  body(ORDER_ROUND_NAME_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_NAME_VALIDATION.empty.message)
    .isString()
    .withMessage(ORDER_ROUND_NAME_VALIDATION.string.message)
    .isLength({
      min: ORDER_ROUND_NAME_VALIDATION.length.min,
      max: ORDER_ROUND_NAME_VALIDATION.length.max,
    })
    .withMessage(ORDER_ROUND_NAME_VALIDATION.length.message)
    .trim(),

  body(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.empty.message)
    .isString()
    .withMessage(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.string.message),

  body(ORDER_ROUND_STARTEDAT_VALIDATION.key)
    .trim()
    .notEmpty()
    .withMessage(ORDER_ROUND_STARTEDAT_VALIDATION.empty.message)
    .isISO8601()
    .withMessage(ORDER_ROUND_STARTEDAT_VALIDATION.ISO8601.message),

  body(ORDER_ROUND_ENDEDAT_VALIDATION.key)
    .trim()
    .notEmpty()
    .withMessage(ORDER_ROUND_ENDEDAT_VALIDATION.empty.message)
    .isISO8601()
    .withMessage(ORDER_ROUND_ENDEDAT_VALIDATION.ISO8601.message),

  body(ORDER_ROUND_MINORDERQTY_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_MINORDERQTY_VALIDATION.empty.message)
    .toInt()
    .isInt()
    .withMessage(ORDER_ROUND_MINORDERQTY_VALIDATION.isInt.message),

  body(ORDER_ROUND_MAXORDERQTY_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_MAXORDERQTY_VALIDATION.empty.message)
    .toInt()
    .isInt()
    .withMessage(ORDER_ROUND_MAXORDERQTY_VALIDATION.isInt.message),
];

/**
 * 주문차수 수정 validate
 */
export const updateOrderRoundValidator = [
  param(ORDER_ROUND_NO_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_NO_VALIDATION.empty.message)
    .isInt({ min: ORDER_ROUND_NO_VALIDATION.int.min })
    .withMessage(ORDER_ROUND_NO_VALIDATION.int.message)
    .toInt()
    .trim(),

  body(ORDER_ROUND_NAME_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_NAME_VALIDATION.empty.message)
    .isString()
    .withMessage(ORDER_ROUND_NAME_VALIDATION.string.message)
    .isLength({
      min: ORDER_ROUND_NAME_VALIDATION.length.min,
      max: ORDER_ROUND_NAME_VALIDATION.length.max,
    })
    .withMessage(ORDER_ROUND_NAME_VALIDATION.length.message)
    .trim(),

  body(ORDER_ROUND_STARTEDAT_VALIDATION.key)
    .trim()
    .notEmpty()
    .withMessage(ORDER_ROUND_STARTEDAT_VALIDATION.empty.message)
    .isISO8601()
    .withMessage(ORDER_ROUND_STARTEDAT_VALIDATION.ISO8601.message),

  body(ORDER_ROUND_ENDEDAT_VALIDATION.key)
    .trim()
    .notEmpty()
    .withMessage(ORDER_ROUND_ENDEDAT_VALIDATION.empty.message)
    .isISO8601()
    .withMessage(ORDER_ROUND_ENDEDAT_VALIDATION.ISO8601.message),

  body(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.empty.message)
    .isString()
    .withMessage(ORDER_ROUND_ORDERROUNDBREADS_VALIDATION.string.message),

  body(ORDER_ROUND_MINORDERQTY_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_MINORDERQTY_VALIDATION.empty.message)
    .toInt()
    .isInt()
    .withMessage(ORDER_ROUND_MINORDERQTY_VALIDATION.isInt.message),

  body(ORDER_ROUND_MAXORDERQTY_VALIDATION.key)
    .notEmpty()
    .withMessage(ORDER_ROUND_MAXORDERQTY_VALIDATION.empty.message)
    .toInt()
    .isInt()
    .withMessage(ORDER_ROUND_MAXORDERQTY_VALIDATION.isInt.message),
];

/**
 * 주문차수 삭제 validate
 */
export const deleteOrderRoundImageValidator = [
  body(PUBLICID_VALIDATION.key)
    .notEmpty()
    .withMessage(PUBLICID_VALIDATION.empty.message)
    .isString()
    .withMessage(PUBLICID_VALIDATION.string.message)
    .trim()
    .escape(),
];
