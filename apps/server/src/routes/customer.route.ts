import { Router } from 'express';
import * as customerController from '@/controllers/customer.controller';
import * as addressController from '@/controllers/address.controller';
import { asyncHandler } from '@/middlewares/error.middleware';
import { optionalAuth, requireAdmin } from '@/middlewares/auth.middleware';
import {
  createAddressValidator,
  deleteAddressValidator,
  getCustomerAddressesValidator,
  getCustomerAddressValidator,
  updateAddressValidator,
  validate,
} from '@/middlewares/validators/validate';
import { createCustomerValidator } from '@/middlewares/validators/customer-validate';
import { authenticateToken } from '@/middlewares/validators/customer-token-validate';

const router = Router();

/** GET /customers : 고객 목록 조회 */
router.get('/', requireAdmin, asyncHandler(customerController.getList));

/** GET /customers/{no} : 고객 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(customerController.getOne));

/** POST /customers : 고객 생성 */
router.post(
  '/',
  optionalAuth,
  validate(createCustomerValidator),
  asyncHandler(customerController.create),
);

/** POST /customers/logout : 고객 로그아웃 */
router.post('/logout', optionalAuth, authenticateToken, asyncHandler(customerController.logout));

/** PUT /customers/{no} : 고객 수정 */
// router.put('/:no', requireAdmin, asyncHandler(customerController.update));

/** DELETE /customers/{no} : 고객 삭제 */
// router.delete('/:no', requireAdmin, asyncHandler(customerController.remove));

/** GET /customers/{no}/address : 고객 주소 목록 조회 */
router.get(
  '/:no/address',
  requireAdmin,
  validate(getCustomerAddressesValidator),
  asyncHandler(addressController.getListByCustomerNo),
);

/** GET /customers/{no}/address/{no} : 고객 주소 상세 조회 */
router.get(
  '/:no/address/:addressNo',
  requireAdmin,
  validate(getCustomerAddressValidator),
  asyncHandler(addressController.getOne),
);

/** POST /customers/{no}/address : 고객 주소 생성 */
router.post(
  '/:no/address',
  requireAdmin,
  validate(createAddressValidator),
  asyncHandler(addressController.create),
);

/** PUT /customers/{no}/address/{no} : 고객 주소 수정 */
router.put(
  '/:no/address/:addressNo',
  requireAdmin,
  validate(updateAddressValidator),
  asyncHandler(addressController.update),
);

/** DELETE /customers/{no}/address/{no} : 고객 주소 삭제 */
router.delete(
  '/:no/address/:addressNo',
  requireAdmin,
  validate(deleteAddressValidator),
  asyncHandler(addressController.remove),
);

export default router;
