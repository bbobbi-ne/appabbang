import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { requireAuth, requireCustomer } from '@/middlewares/auth.middleware';
import { loginValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { KakaoClient } from '@/lib/kakao';
import {
  createCustomerValidator,
  loginCustomerValidator,
} from '@/middlewares/validators/customer-validate';
import * as CustomerController from '@/controllers/customer.controller';

const router = Router();

/** POST /auth/login : 로그인 */
router.post('/login', validate(loginValidator), asyncHandler(authController.login));

/** GET /auth/me : 내 정보 조회 */
router.get('/me', requireAuth, asyncHandler(authController.me));

/** GET /auth/kakao/url : 카카오 로그인 URL 발급 */
router.get('/kakao/url', (_, res) => {
  const url = KakaoClient.getAuthCodeURL();

  res.status(200).json({
    url,
  });
});

/** POST /auth/customers/login : 고객 회원가입 */
router.post(
  '/customers/join',
  validate(createCustomerValidator),
  asyncHandler(CustomerController.create),
);

/** POST /customers/login : 고객 로그인 */
router.post(
  '/customers/login',
  validate(loginCustomerValidator),
  asyncHandler(CustomerController.login),
);

/** POST /customers/logout : 고객 로그아웃 */
router.post('/customers/logout', requireCustomer, asyncHandler(CustomerController.logout));

/** POST /auth/refresh : 액세스 토큰 재발급 */
router.post('/refresh', asyncHandler(authController.refresh));

/** POST /auth/kakao/login : 카카오 로그인 */
router.post('/kakao/login', async (req, res, next) => {
  try {
    const { code } = req.body;

    const { access_token } = await KakaoClient.getToken(code); // 토큰 받아오기
    const userData = await KakaoClient.getUserData(access_token); // 유저 정보 받아오기

    // 그 후 DB로 사용자 등록 처리
    // 세션 or 토큰 처리
    // 등등 로그인 관련 처리를 해줘야 함

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);

    const errorData = {
      message: 'Internal server error.. :(',
    };
    res.status(500).json(errorData);
  }

  console.log('/login finish');
});

export default router;
