import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import {
  createCommonCodeValidator,
  createCommonCodeValidator as updateCommonCodeValidator,
  validate,
} from '@/middlewares/validators/validate';
import * as commonCodeController from '@/controllers/common-code.controller';

const router = Router();

// GET /common-code
router.get('/', commonCodeController.getCommonCode);

// GET /common-code/:groupName
router.get('/:groupName', commonCodeController.getCommonCodeByGroupName);

// POST /common-code
router.post(
  '/',
  authenticateToken,
  validate(createCommonCodeValidator),
  commonCodeController.createCommonCode,
);

// PUT /common-code/:no
router.put(
  '/:no',
  authenticateToken,
  validate(updateCommonCodeValidator),
  commonCodeController.updateCommonCode,
);

// DELETE /common-code/:no
router.delete('/:no', authenticateToken, commonCodeController.deleteCommonCode);

export default router;
