import { Router } from 'express';
import { asyncHandler } from '@/middlewares/error.middleware';
import * as myController from '@/controllers/my.controller';
import { requireCustomerOwner } from '@/middlewares/auth.middleware';
import {
  createMyAddressValidator,
  updateMyAddressValidator,
  validate,
  updateOrderAddressValidator,
  cancelOrderValidator,
  paramsNoValidator,
} from '@/middlewares/validators/validate';
import {
  updateCustomerPwValidator,
  updateCustomerValidator,
} from '@/middlewares/validators/auth-validate';

const router = Router();

// MY 는 사실상 모두 [고객] 본인으로 봐야할듯..?

/** GET /my : 내 정보 조회 */
router.get('/', requireCustomerOwner, asyncHandler(myController.getInfo));
/** GET /my/summary : 내 정보 + 주문 누적금액 + 총 보유 쿠폰 수 조회 */
router.get('/summary', requireCustomerOwner, asyncHandler(myController.getLayoutInfo));

/** PUT /my : 내 정보 수정 */
router.put(
  '/',
  requireCustomerOwner,
  validate(updateCustomerValidator),
  asyncHandler(myController.update),
);

/** PUT /my/pw : 내 정보 수정 - 비밀번호 변경 */
router.put(
  '/pw',
  requireCustomerOwner,
  validate(updateCustomerPwValidator),
  asyncHandler(myController.updatePw),
);

// >>>>>> 배송지 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** GET /my/addresses : 배송지 목록 조회 */
router.get('/addresses', requireCustomerOwner, asyncHandler(myController.getAddressList));

/** GET /my/addresses/{no} : 배송지 상세 조회 */
router.get(
  '/addresses/:no',
  requireCustomerOwner,
  validate(paramsNoValidator),
  asyncHandler(myController.getAddressOne),
);

/** POST /my/addresses : 배송지 등록 */
router.post(
  '/addresses',
  requireCustomerOwner,
  validate(createMyAddressValidator),
  asyncHandler(myController.createAddress),
);

/** PUT /my/addresses/{no} : 배송지 수정 */
router.put(
  '/addresses/:no',
  requireCustomerOwner,
  validate(updateMyAddressValidator),
  asyncHandler(myController.updateAddress),
);

/** DELETE /my/addresses/{no} : 배송지 삭제 */
router.delete(
  '/addresses/:no',
  requireCustomerOwner,
  validate(paramsNoValidator),
  asyncHandler(myController.removeAddress),
);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** GET /my/orders : 내 주문내역 조회 */
router.get('/orders', requireCustomerOwner, asyncHandler(myController.getOrders));

/** GET /my/order/{no} : 내 상세주문 조회 */
router.get(
  '/order/:no',
  requireCustomerOwner,
  validate(paramsNoValidator),
  asyncHandler(myController.getOrder),
);

/** POST /my/order/{no}/cancel : 내 주문 취소 */
router.post(
  '/order/:no/cancel',
  requireCustomerOwner,
  validate(cancelOrderValidator),
  asyncHandler(myController.cancelOrder),
);

/** GET /my/order/{no}/delivery : 내 주문배송(수령) 조회 */
router.get(
  '/order/:no/delivery',
  requireCustomerOwner,
  validate(paramsNoValidator),
  asyncHandler(myController.getOrderDelivery),
);

/** GET /my/order/{no}/address : 내 주문 배송지 조회 */
router.get(
  '/order/:no/address',
  requireCustomerOwner,
  validate(paramsNoValidator),
  asyncHandler(myController.getOrderAddress),
);

/** PUT /my/order/{no}/address : 내 주문 배송지 수정 */
router.put(
  '/order/:no/address',
  requireCustomerOwner,
  validate(updateOrderAddressValidator),
  asyncHandler(myController.updateOrderAddress),
);

export default router;
