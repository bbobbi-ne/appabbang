import { RequestHandler } from 'express';
import { validationResult, body } from 'express-validator';

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

export const loginValidator = [
  body('id').trim().notEmpty().withMessage('id 는 필수입니다'),
  body('pw').trim().notEmpty().withMessage('pw 는 필수입니다'),
];
