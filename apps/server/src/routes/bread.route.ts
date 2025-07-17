import { Router } from 'express';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';
import * as breadsController from '@/controllers/bread.controller';
import {
  createBreadValidator,
  deleteBreadValidator,
  deleteBreadImageValidator,
  getBreadsValidator,
  getBreadValidator,
  updateBreadStatusValidator,
  updateBreadValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/** GET /breads : 빵 목록 조회 */
router.get('/', optionalAuth, validate(getBreadsValidator), asyncHandler(breadsController.getList));

/** GET /breads/{no} : 빵 상세 조회 */
router.get(
  '/:no',
  optionalAuth,
  validate(getBreadValidator),
  asyncHandler(breadsController.getByNo),
);

/** POST /breads : 빵 등록 */
router.post(
  '/',
  requireAdmin,
  validate(createBreadValidator),
  asyncHandler(breadsController.create),
);

/** PUT /breads/{no} : 빵 수정 */
router.put(
  '/:no',
  requireAdmin,
  validate(updateBreadValidator),
  asyncHandler(breadsController.update),
);

/** PUT /breads/{no}/status : 빵 상태 수정 */
router.put(
  '/:no/status',
  requireAdmin,
  validate(updateBreadStatusValidator),
  asyncHandler(breadsController.updateBreadStatus),
);

/** DELETE /breads : 빵 삭제 (여러건) */
router.delete(
  '/',
  requireAdmin,
  validate(deleteBreadValidator),
  asyncHandler(breadsController.remove),
);

/** DELETE /breads/image : 빵 이미지 삭제 */
router.delete(
  '/image',
  requireAdmin,
  validate(deleteBreadImageValidator),
  asyncHandler(breadsController.removeImage),
);

export default router;
