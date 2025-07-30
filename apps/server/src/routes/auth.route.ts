import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { loginValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';
import { KakaoClient } from '@/lib/kakao';

const router = Router();

/** POST /auth/login : 로그인 */
router.post('/login', validate(loginValidator), asyncHandler(authController.login));

/** GET /auth/me : 내 정보 조회 */
router.get('/me', requireAuth, asyncHandler(authController.me));

/** POST /auth/refresh : 액세스 토큰 재발급 */
router.post('/refresh', asyncHandler(authController.refresh));

/** GET /auth/kakao/url : 카카오 로그인 URL 발급 */
router.get('/kakao/url', (_, res) => {
  const url = KakaoClient.getAuthCodeURL();

  res.status(200).json({
    url,
  });
});

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
