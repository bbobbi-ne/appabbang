import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { loginValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/** POST /auth/login : 로그인 */
router.post('/login', validate(loginValidator), asyncHandler(authController.login));

/** GET /auth/me : 내 정보 조회 */
router.get('/me', requireAuth, asyncHandler(authController.me));

/** POST /auth/refresh : 액세스 토큰 재발급 */
router.post('/refresh', asyncHandler(authController.refresh));

export default router;
