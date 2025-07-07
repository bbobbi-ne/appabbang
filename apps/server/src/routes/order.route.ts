import { Router } from 'express';
// import { authenticateToken } from '@/middlewares/auth.middleware';
import * as orderController from '@/controllers/order.controller';
import {
  createOrderValidator,
  deleteOrderValidator,
  updateOrderPaidValidator,
  updateOrderStatusValidator,
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

/** PUT /orders/{no}/status : 주문 상태 수정 */
router.put(
  '/:no/status',
  requireAdmin,
  validate(updateOrderStatusValidator),
  asyncHandler(orderController.updateOrderStatus),
);

/** PUT /orders/{no}/paid : 주문 입금확인여부 수정 */
router.put(
  '/:no/paid',
  requireAdmin,
  validate(updateOrderPaidValidator),
  asyncHandler(orderController.updateOrderPaid),
);

/** DELETE /orders/{no} : 주문 삭제 */
router.delete(
  '/:no',
  requireAdmin,
  validate(deleteOrderValidator),
  asyncHandler(orderController.remove),
);

export default router;
