import { RequestHandler } from 'express';
import { validationResult, body, query } from 'express-validator';
import { CodeGroup } from '@/types';

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

      res.status(400).json({ message: errors.array()[0]?.msg });
    })().catch(next);
  };
};

export const createCommonCodeValidator = [
  body('groupName')
    .isIn(Object.values(CodeGroup))
    .withMessage(`유효한 그룹명이 아닙니다. (그룹명: ${Object.values(CodeGroup).join(', ')})`),
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('code').trim().notEmpty().withMessage('코드는 필수입니다'),
];

export const loginValidator = [
  body('id').trim().notEmpty().withMessage('id 는 필수입니다'),
  body('pw').trim().notEmpty().withMessage('pw 는 필수입니다'),
];

export const getBreadsValidator = [
  query('breadStatus')
    .optional()
    .trim()
    .isIn(['10', '20', '30', '40', '50'])
    .withMessage('유효한 상태여야 합니다 (10, 20, 30, 40, 50)'),
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

export const deleteBreadValidator = [
  body('noList')
    .exists()
    .withMessage('noList는 필수입니다')
    .isArray({ min: 1 })
    .withMessage('noList는 하나 이상의 요소를 가진 배열이어야 합니다.'),
  body('noList.*').isInt().toInt().withMessage('noList 안의 값은 정수여야 합니다.'),
];

export const deleteImageValidator = [
  body('no')
    .exists()
    .withMessage('no는 필수입니다')
    .isInt()
    .toInt()
    .withMessage('no는 정수여야 합니다.'),
  body('publicId')
    .exists()
    .withMessage('publicId는 필수입니다')
    .trim()
    .notEmpty()
    .withMessage('publicId는 비어있을 수 없습니다.'),
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
  body('fee').optional().isInt().toInt().withMessage('fee는 정수여야 합니다.'),
  body('isActive').optional().isBoolean().toBoolean().withMessage('boolean 타입이어야 합니다.'),
];

export const createAddressValidator = [
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
];

export const updateAddressValidator = [
  body('address').trim().notEmpty().withMessage('address는 필수입니다'),
  body('addressDetail').trim().notEmpty().withMessage('addressDetail는 필수입니다'),
  body('zipcode').trim().notEmpty().withMessage('zipcode는 필수입니다'),
  body('recipientName').trim().notEmpty().withMessage('recipientName은 필수입니다'),
  body('recipientMobile').trim().notEmpty().withMessage('recipientMobile은 필수입니다'),
];
