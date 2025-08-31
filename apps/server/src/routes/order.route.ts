import { Router } from 'express';
import * as orderController from '@/controllers/order.controller';
import {
  createOrderValidator,
  updateOrderStatusValidator,
  updateOrderTrackingNumberValidator,
  updateOrderValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';

const router = Router();

/** GET /orders : 주문 목록 조회 */
router.get('/', requireAdmin, asyncHandler(orderController.getList));

/** GET /orders/{no} : 주문 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(orderController.getOne));

/** POST /orders : 주문 생성 */
router.post(
  '/',
  optionalAuth,
  validate(createOrderValidator),
  asyncHandler(orderController.create),
);

/** PUT /orders/{no} : 주문 수정 */
router.put(
  '/:no',
  requireAdmin,
  validate(updateOrderValidator),
  asyncHandler(orderController.update),
);

/** patch /orders/{no}/tracking-number : 송장번호 업데이트 */
router.put(
  '/:no/tracking-number',
  requireAdmin,
  validate(updateOrderTrackingNumberValidator),
  asyncHandler(orderController.updateTrackingNumber),
);

/** PUT /orders/{no}/status : 주문 상태 수정 */
router.put(
  '/:no/status',
  requireAdmin,
  validate(updateOrderStatusValidator),
  asyncHandler(orderController.updateOrderStatus),
);

export default router;
