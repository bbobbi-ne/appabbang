import { Router } from 'express';
import * as couponController from '@/controllers/coupon.controller';
import { asyncHandler } from '@/middlewares/error.middleware';
import { requireAdmin } from '@/middlewares/auth.middleware';
import {
  createCouponValidator,
  deleteCouponValidator,
  updateCouponValidator,
  validate,
} from '@/middlewares/validators/validate';

const router = Router();

/** GET /coupons : 쿠폰 목록 조회 */
router.get('/', requireAdmin, asyncHandler(couponController.getList));

/** GET /coupons/{no} : 쿠폰 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(couponController.getOne));

/** POST /coupons : 쿠폰 생성 */
router.post(
  '/',
  requireAdmin,
  validate(createCouponValidator),
  asyncHandler(couponController.create),
);

/** PUT /coupons/{no} : 쿠폰 수정 */
router.put(
  '/:no',
  requireAdmin,
  validate(updateCouponValidator),
  asyncHandler(couponController.update),
);

/** DELETE /coupons/{no} : 쿠폰 삭제 */
router.delete(
  '/:no',
  requireAdmin,
  validate(deleteCouponValidator),
  asyncHandler(couponController.remove),
);

export default router;
