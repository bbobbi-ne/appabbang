import { RequestHandler } from 'express';
import { validationResult, body } from 'express-validator';
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

export const createBreadValidator = [
  body('name').trim().notEmpty().withMessage('이름은 필수입니다'),
  body('unitPrice')
    .notEmpty()
    .withMessage('가격은 필수입니다')
    .isFloat({ min: 0 })
    .withMessage('가격은 숫자여야 합니다')
    .toFloat(),
  body('status')
    .isIn(['available', 'unavailable', 'upcoming', 'draft'])
    .withMessage('유효한 상태여야 합니다 (available, unavailable, upcoming, draft)'),
];
