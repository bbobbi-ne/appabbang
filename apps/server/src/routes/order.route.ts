import { Router } from 'express';
import * as orderController from '@/controllers/order.controller';
import * as myController from '@/controllers/my.controller';
import {
  cancelOrderValidator,
  createOrderValidator,
  guestOrderPwValidator,
  guestValidator,
  paramsNoValidator,
  updateOrderAddressValidator,
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

/**
 *
 *
 *
 *
 * guest 전용 router
 */
/** POST /orders/guest : [비회원] 주문 목록 조회 */
router.post('/guest', validate(guestValidator), asyncHandler(orderController.getGuestOrders));

/** PUT /orders/guest/pw : [비회원] 주문 비밀번호를 임시 비밀번호로 변경한 뒤 이메일 전송 */
router.put(
  '/guest/pw',
  validate(guestOrderPwValidator),
  asyncHandler(orderController.updateGuestOrderPwSendEmail),
);

/** GET /orders/guest/{no} : [비회원] 주문 조회 */
router.get('/guest/:no', asyncHandler(myController.getOrder));

/** GET /orders/guest/{no}/address : [비회원] 주문 상세내역의 배송지 조회 */
router.get('/guest/:no/address', asyncHandler(myController.getOrderDelivery));

/** PUT /orders/guest/{no}/address : [비회원] 주문 상세내역의 배송지 수정 */
router.put(
  '/guest/:no/address',
  validate(updateOrderAddressValidator),
  asyncHandler(myController.updateOrderAddress),
);

/** GET /orders/guest/{no}/delivery : [비회원] 주문 상세내역의 배송(수령)현황 조회 */
router.get(
  '/guest/:no/delivery',
  validate(paramsNoValidator),
  asyncHandler(myController.getOrderDelivery),
);

/** POST /orders/guest/{no}/cancel : 내 주문 취소 */
router.post(
  '/guest/:no/cancel',
  validate(cancelOrderValidator),
  asyncHandler(orderController.cancelOrder),
);
/**
 *
 *
 *
 *
 *
 */

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
