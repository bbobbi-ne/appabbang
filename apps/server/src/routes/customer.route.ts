import { Router } from 'express';
import * as customerController from '@/controllers/customer.controller';
import * as addressController from '@/controllers/address.controller';
import { asyncHandler } from '@/middlewares/error.middleware';
import { requireAdmin } from '@/middlewares/auth.middleware';
import {
  createAddressValidator,
  deleteAddressValidator,
  getCustomerAddressesValidator,
  getCustomerAddressValidator,
  updateAddressValidator,
  validate,
} from '@/middlewares/validators/validate';
import {
  createCustomerValidator,
  emailCodeValidator,
  idEmailPwValidator,
  idEmailValidator,
  sendEmailValidator,
} from '@/middlewares/validators/auth-validate';

const router = Router();

/** GET /customers : 고객 목록 조회 */
router.get('/', requireAdmin, asyncHandler(customerController.getList));

/** GET /customers/{no} : 고객 상세 조회 */
router.get('/:no', requireAdmin, asyncHandler(customerController.getOne));

/** PUT /customers/{no} : 고객 수정 */
// router.put('/:no', requireAdmin, asyncHandler(customerController.update));

/** DELETE /customers/{no} : 고객 삭제 */
// router.delete('/:no', requireAdmin, asyncHandler(customerController.remove));

/** POST /auth/customers/join : 고객 회원가입 */
router.post('/', validate(createCustomerValidator), asyncHandler(customerController.create));

/** POST /customers/email : 고객 이메일 조회 */
router.post('/email', validate(sendEmailValidator), asyncHandler(customerController.getEmail));

/** POST /customers/send-email : 고객 회원가입 시 이메일로 인증코드 전송 */
router.post(
  '/send-email',
  validate(sendEmailValidator),
  asyncHandler(customerController.sendEmailCode),
);

/** POST /customers/id : 고객 아이디 조회 */
router.post('/id', validate(sendEmailValidator), asyncHandler(customerController.getId));

/** POST /customers/id-email : 고객 아이디, 이메일 조회 */
router.post('/id-email', validate(idEmailValidator), asyncHandler(customerController.getIdEmail));

/** POST /customers/pw : 고객 아이디, 이메일과 매핑되는 비밀번호 변경 */
router.post('/pw', validate(idEmailPwValidator), asyncHandler(customerController.modifyPw));

/** POST /customers/code-compare : 고객의 입력한 인증번호와 해싱된 인증번호 비교 */
router.post(
  '/compare-code',
  validate(emailCodeValidator),
  asyncHandler(customerController.compareCode),
);

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
