import { Router } from 'express';
import { asyncHandler } from '@/middlewares/error.middleware';
import * as myController from '@/controllers/my.controller';
import { requireCustomerOwner } from '@/middlewares/auth.middleware';
import {
  getMyAddressValidator,
  createMyAddressValidator,
  updateMyAddressValidator,
  deleteMyAddressValidator,
} from '@/middlewares/validators/validate';

const router = Router();

// >>>>>> 배송지 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** GET /my/addresses : 배송지 목록 조회 */
router.get('/addresses', requireCustomerOwner, asyncHandler(myController.getAddressList));

/** GET /my/addresses/{no} : 배송지 상세 조회 */
router.get(
  '/addresses/:no',
  requireCustomerOwner,
  getMyAddressValidator,
  asyncHandler(myController.getAddressOne),
);

/** POST /my/addresses : 배송지 등록 */
router.post(
  '/addresses',
  requireCustomerOwner,
  createMyAddressValidator,
  asyncHandler(myController.createAddress),
);

/** PUT /my/addresses/{no} : 배송지 수정 */
router.put(
  '/addresses/:no',
  requireCustomerOwner,
  updateMyAddressValidator,
  asyncHandler(myController.updateAddress),
);

/** DELETE /my/addresses/{no} : 배송지 삭제 */
router.delete(
  '/addresses/:no',
  requireCustomerOwner,
  deleteMyAddressValidator,
  asyncHandler(myController.removeAddress),
);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default router;
