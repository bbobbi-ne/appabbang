/**
 * 주문차수 Route
 */
import { Router } from 'express';
import * as orderRoundController from '@/controllers/order-round.controller';
import {
  createOrderRoundValidator,
  deleteOrderRoundImageValidator,
  updateOrderRoundValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router = Router();

/** GET /order-round : 주문차수 목록 조회 */
router.get('/', requireAdmin, asyncHandler(orderRoundController.getList));

/** GET /order-round/{no} : 주문차수 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(orderRoundController.getOne));

/** POST /order-round : 주문차수 생성 */
router.post(
  '/',
  optionalAuth,
  validate(createOrderRoundValidator),
  asyncHandler(orderRoundController.create),
);

/** PUT /order-round/{no} : 주문차수 수정 */
router.put(
  '/:no',
  requireAdmin,
  validate(updateOrderRoundValidator),
  asyncHandler(orderRoundController.update),
);

/** DELETE /order-round/image : 주문차수 이미지 삭제 */
router.delete(
  '/image',
  requireAdmin,
  validate(deleteOrderRoundImageValidator),
  asyncHandler(orderRoundController.removeImage),
);

export default router;
