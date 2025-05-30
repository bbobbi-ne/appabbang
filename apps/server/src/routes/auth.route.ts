import { Router } from 'express';
import { login, me, refresh } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();

// POST /auth/login
router.post('/login', login);

// GET /auth/me
router.get('/me', authenticateToken, me);

// POST /auth/refresh
router.post('/refresh', refresh);

export default router;
