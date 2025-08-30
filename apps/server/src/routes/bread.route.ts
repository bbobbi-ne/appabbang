import { Router } from 'express';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';
import * as breadsController from '@/controllers/bread.controller';
import {
  createBreadValidator,
  deleteBreadValidator,
  deleteBreadImageValidator,
  getBreadsValidator,
  getBreadValidator,
  updateBreadValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/** GET /breads : 빵 목록 조회 */
router.get('/', optionalAuth, validate(getBreadsValidator), asyncHandler(breadsController.getList));

/** GET /breads/with-order-round : 빵 목록 조회 (주문차수에 속했는지 포함) */
router.get('/with-order-round', asyncHandler(breadsController.getBreadListWithOrderRound));

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
