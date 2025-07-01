import { Router } from 'express';
import { login, me, refresh } from '@/controllers/auth.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { loginValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 사용자 로그인을 수행합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - pw
 *             properties:
 *               id:
 *                 type: string
 *                 description: 사용자 ID
 *                 example: "admin"
 *               pw:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 액세스 토큰
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         headers:
 *           Set-Cookie:
 *             description: 리프레시 토큰이 쿠키로 설정됩니다
 *             schema:
 *               type: string
 *               example: "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict"
 *       401:
 *         description: 인증 실패 (잘못된 ID 또는 비밀번호)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/login', validate(loginValidator), asyncHandler(login));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 내 정보 조회
 *     description: 현재 로그인한 사용자의 정보를 조회합니다.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 사용자 ID
 *                   example: "admin"
 *                 name:
 *                   type: string
 *                   description: 사용자 이름
 *                   example: "관리자"
 *                 userRole:
 *                   type: string
 *                   description: "사용자 역할 (10-관리자, 20-일반사용자)"
 *                   example: "10"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/me', authenticateToken, asyncHandler(me));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 액세스 토큰 재발급
 *     description: 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 액세스 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 새로운 액세스 토큰
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 리프레시 토큰 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token missing"
 *       403:
 *         description: 유효하지 않은 리프레시 토큰
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/refresh', asyncHandler(refresh));

export default router;
