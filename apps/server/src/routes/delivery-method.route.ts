import { Router } from 'express';
// import { authenticateToken } from '@/middlewares/auth.middleware';
import * as deliveryMethodController from '@/controllers/delivery-method.controller';
import {
  createDeliveryMethodValidator,
  getDeliveryMethodValidator,
  updateDeliveryMethodValidator,
} from '@/middlewares/validators/validate';
import { validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { requireAdmin } from '@/middlewares/auth.middleware';

const router = Router();

/** GET /delivery-methods : 배송 방법 목록 조회 */
router.get('/', requireAdmin, asyncHandler(deliveryMethodController.getList));

/** GET /delivery-methods/active : 활성화된 배송 방법 목록 조회 */
router.get('/active', asyncHandler(deliveryMethodController.getListByActive));

/** GET /delivery-methods/{no} : 배송 방법 상세 조회 */
router.get(
  '/:no',
  requireAdmin,
  validate(getDeliveryMethodValidator),
  asyncHandler(deliveryMethodController.getOne),
);

/** POST /delivery-methods : 배송 방법 생성 */
router.post(
  '/',
  requireAdmin,
  validate(createDeliveryMethodValidator),
  asyncHandler(deliveryMethodController.create),
);

/** PUT /delivery-methods/{no} : 배송 방법 수정 */
router.put(
  '/:no',
  requireAdmin,
  validate(updateDeliveryMethodValidator),
  asyncHandler(deliveryMethodController.update),
);

/** DELETE /delivery-methods/{no} : 배송 방법 삭제 */
router.delete('/:no', requireAdmin, asyncHandler(deliveryMethodController.remove));

export default router;
