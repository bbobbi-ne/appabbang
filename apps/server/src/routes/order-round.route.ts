/**
 * 주문차수 Route
 */
import { Router } from 'express';
import * as orderRoundController from '@/controllers/order-round.controller';
import { validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';
import {
  createOrderRoundValidator,
  deleteOrderRoundImageValidator,
  updateOrderRoundValidator,
} from '@/middlewares/validators/order-round.validate';

const router = Router();

/** GET /order-round : 주문차수 목록 조회 */
router.get('/', optionalAuth, asyncHandler(orderRoundController.getList));

/** GET /order-round/latest : 최신 주문차수 조회 */
router.get('/latest', optionalAuth, asyncHandler(orderRoundController.getLatest));

/** GET /order-round/now : 현재일자에 진행중인 주문차수 조회 */
router.get('/now', optionalAuth, asyncHandler(orderRoundController.getNow));

/** GET /order-round/{no} : 주문차수 상세 조회 */
router.get('/:no', optionalAuth, asyncHandler(orderRoundController.getOne));

/** POST /order-round : 주문차수 생성 */
router.post(
  '/',
  requireAdmin,
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
