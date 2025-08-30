import { asyncHandler } from '@/middlewares/error.middleware';
import { loginGuestValidator, validate } from '@/middlewares/validators/validate';
import { Router } from 'express';
import * as guestController from '@/controllers/guest.controller';

const router = Router();

/** POST /guest/login : 비회원 로그인 */
router.post('/login', validate(loginGuestValidator), asyncHandler(guestController.login));

export default router;
