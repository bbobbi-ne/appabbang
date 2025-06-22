import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as deliveryMethodController from '@/controllers/delivery-method.controller';
import {
  createDeliveryMethodValidator,
  updateDeliveryMethodValidator,
} from '@/middlewares/validators/validate';
import { validate } from '@/middlewares/validators/validate';

const router = Router();

// GET /delivery-method
router.get('/', deliveryMethodController.getList);

// GET /delivery-method/active
router.get('/active', deliveryMethodController.getListByActive);

// GET /delivery-method/:no
router.get('/:no', authenticateToken, deliveryMethodController.getOne);

// POST /delivery-method /// 서버에서만 사용 (공통코드 캐싱 새로고침 필요)
router.post(
  '/',
  authenticateToken,
  validate(createDeliveryMethodValidator),
  deliveryMethodController.create,
);

// PUT /delivery-method/:no /// 서버에서만 사용 (공통코드 캐싱 새로고침 필요)
router.put(
  '/:no',
  authenticateToken,
  validate(updateDeliveryMethodValidator),
  deliveryMethodController.update,
);

// DELETE /delivery-method/:no /// 서버에서만 사용 (공통코드 캐싱 새로고침 필요)
router.delete('/:no', authenticateToken, deliveryMethodController.remove);

export default router;
