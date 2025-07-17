import { Router } from 'express';
import { requireAdmin } from '@/middlewares/auth.middleware';
import { asyncHandler } from '@/middlewares/error.middleware';
import * as paymentController from '@/controllers/payment.controller';

const router = Router();

/** GET /payments : 결제 목록 조회 */
router.get('/', asyncHandler(paymentController.getList));

/** GET /payments/{no} : 결제 상세 조회 */
router.get('/:no', asyncHandler(paymentController.getOneByNo));

/** PUT /payments/{no}/paid : 결제 입금 확인 변경 */
router.put('/:no/paid', asyncHandler(paymentController.updatePaid));

/** PUT /payments/{no}/refund : 결제 환불 확인 변경 */
router.put('/:no/refund', asyncHandler(paymentController.updateRefund));

export default router;
