/**
 * 주문차수 Route
 */
import { Router } from 'express';
import * as orderRoundController from '@/controllers/order-round.controller';
import { paramsNoValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';
import {
  createOrderRoundValidator,
  deleteOrderRoundImageValidator,
  updateOrderRoundValidator,
} from '@/middlewares/validators/order-round.validate';

const router = Router();

/** GET /order-round/current : 현재 주문차수 조회 (now or next) */
router.get('/current', asyncHandler(orderRoundController.getCurrent));

/** GET /order-round/open/:no : 오픈된 특정 주문차수 조회 */
router.get(
  '/open/:no',
  optionalAuth,
  validate(paramsNoValidator),
  asyncHandler(orderRoundController.getOpenByNo),
);

/** GET /order-round/:no/now : 주문차수가 진행중인지 확인하는 라우트 */
router.get(
  '/:no/is-open',
  optionalAuth,
  validate(paramsNoValidator),
  asyncHandler(orderRoundController.checkOpenByNo),
);

////////////////////////////////////////////////////////////////////////////////////

/** GET /order-round : 주문차수 목록 조회 */
router.get('/', requireAdmin, asyncHandler(orderRoundController.getList));

/** GET /order-round/{no} : 주문차수 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(orderRoundController.getOne));

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
