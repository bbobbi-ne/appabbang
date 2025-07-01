import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as sampleController from '@/controllers/sample.controller';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: 샘플 목록 조회
 *     description: 샘플 데이터 목록을 조회합니다.
 *     tags: [Sample]
 *     responses:
 *       200:
 *         description: 샘플 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.get('/', asyncHandler(sampleController.getList));

/**
 * @swagger
 * /sample/all:
 *   get:
 *     summary: 전체 샘플 목록 조회
 *     description: 전체 샘플 데이터 목록을 조회합니다.
 *     tags: [Sample]
 *     responses:
 *       200:
 *         description: 전체 샘플 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.get('/all', asyncHandler(sampleController.getListAll));

/**
 * @swagger
 * /sample/{no}:
 *   get:
 *     summary: 샘플 상세 조회
 *     description: 특정 샘플 데이터의 상세 정보를 조회합니다.
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 샘플 번호
 *         example: 1
 *     responses:
 *       200:
 *         description: 샘플 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.get('/:no', asyncHandler(sampleController.getOne));

/**
 * @swagger
 * /sample:
 *   post:
 *     summary: 샘플 생성
 *     description: 새로운 샘플 데이터를 생성합니다.
 *     tags: [Sample]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 샘플 이름
 *                 example: "샘플 데이터"
 *     responses:
 *       201:
 *         description: 샘플 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.post('/', asyncHandler(sampleController.create));

/**
 * @swagger
 * /sample/{no}:
 *   put:
 *     summary: 샘플 수정
 *     description: 특정 샘플 데이터를 수정합니다.
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 샘플 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 샘플 이름
 *                 example: "수정된 샘플 데이터"
 *     responses:
 *       200:
 *         description: 샘플 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.put('/:no', asyncHandler(sampleController.update));

/**
 * @swagger
 * /sample/{no}:
 *   delete:
 *     summary: 샘플 삭제
 *     description: 특정 샘플 데이터를 삭제합니다.
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 샘플 번호
 *         example: 1
 *     responses:
 *       204:
 *         description: 샘플 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World"
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
router.delete('/:no', asyncHandler(sampleController.remove));

export default router;
