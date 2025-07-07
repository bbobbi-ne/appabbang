import { Router } from 'express';
import { requireAdmin } from '@/middlewares/auth.middleware';
import {
  createCommonCodeValidator,
  getCommonCodeListValidator,
  // getCommonCodeListValidator,
  updateCommonCodeValidator,
  validate,
} from '@/middlewares/validators/validate';
import * as commonCodeController from '@/controllers/common-code.controller';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/** GET /common-code : 공통 코드 목록 조회 */
router.get('/', asyncHandler(commonCodeController.getList));

/** GET /common-code/{groupName} : 공통 코드 그룹별 조회 */
router.get(
  '/:groupName',
  validate(getCommonCodeListValidator),
  asyncHandler(commonCodeController.getListByGroupName),
);

/** POST /common-code : 공통 코드 생성 (관리자 전용) */
router.post(
  '/',
  requireAdmin,
  validate(createCommonCodeValidator),
  asyncHandler(commonCodeController.create),
);

/** PUT /common-code/{no} : 공통 코드 수정 (관리자 전용) */
router.put(
  '/:no',
  requireAdmin,
  validate(updateCommonCodeValidator),
  asyncHandler(commonCodeController.update),
);

/** DELETE /common-code/{no} : 공통 코드 삭제 (관리자 전용) */
router.delete('/:no', requireAdmin, asyncHandler(commonCodeController.remove));

export default router;
