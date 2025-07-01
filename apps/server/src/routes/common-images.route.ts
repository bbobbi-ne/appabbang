import { Router } from 'express';
import * as commonImagesController from '@/controllers/common-images.controller';
import { deleteImageValidator, validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /common-images:
 *   get:
 *     summary: 공통 이미지 목록 조회
 *     description: Cloudinary에 업로드된 모든 이미지 목록을 조회합니다.
 *     tags: [Common Images]
 *     responses:
 *       200:
 *         description: 이미지 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       public_id:
 *                         type: string
 *                         description: 이미지 공개 ID
 *                         example: "bread_123"
 *                       secure_url:
 *                         type: string
 *                         description: 이미지 URL
 *                         example: "https://res.cloudinary.com/example/image/upload/v1234567890/bread_123.jpg"
 *                       format:
 *                         type: string
 *                         description: 이미지 형식
 *                         example: "jpg"
 *                       width:
 *                         type: integer
 *                         description: 이미지 너비
 *                         example: 800
 *                       height:
 *                         type: integer
 *                         description: 이미지 높이
 *                         example: 600
 *                       bytes:
 *                         type: integer
 *                         description: 파일 크기 (바이트)
 *                         example: 123456
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: 업로드 시간
 *                         example: "2024-01-01T00:00:00.000Z"
 *                 rate_limit_allowed:
 *                   type: integer
 *                   description: 허용된 요청 수
 *                   example: 500
 *                 rate_limit_reset_at:
 *                   type: string
 *                   format: date-time
 *                   description: 요청 제한 리셋 시간
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 rate_limit_remaining:
 *                   type: integer
 *                   description: 남은 요청 수
 *                   example: 499
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
router.get('/', asyncHandler(commonImagesController.getImages));

/**
 * @swagger
 * /common-images/upload:
 *   post:
 *     summary: 공통 이미지 업로드
 *     description: Cloudinary에 이미지를 업로드합니다.
 *     tags: [Common Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 업로드할 이미지 파일들
 *     responses:
 *       201:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   public_id:
 *                     type: string
 *                     description: 이미지 공개 ID
 *                     example: "bread_123"
 *                   secure_url:
 *                     type: string
 *                     description: 이미지 URL
 *                     example: "https://res.cloudinary.com/example/image/upload/v1234567890/bread_123.jpg"
 *                   original_filename:
 *                     type: string
 *                     description: 원본 파일명
 *                     example: "croissant.jpg"
 *                   format:
 *                     type: string
 *                     description: 이미지 형식
 *                     example: "jpg"
 *                   width:
 *                     type: integer
 *                     description: 이미지 너비
 *                     example: 800
 *                   height:
 *                     type: integer
 *                     description: 이미지 높이
 *                     example: 600
 *                   bytes:
 *                     type: integer
 *                     description: 파일 크기 (바이트)
 *                     example: 123456
 *       400:
 *         description: 이미지 파일이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미지를 업로드해주세요."
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
router.post('/upload', asyncHandler(commonImagesController.uploadImages));

/**
 * @swagger
 * /common-images/delete:
 *   delete:
 *     summary: 공통 이미지 삭제
 *     description: Cloudinary에서 이미지를 삭제합니다.
 *     tags: [Common Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicIds
 *             properties:
 *               publicIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 삭제할 이미지들의 public ID 배열
 *                 example: ["bread_123", "bread_456"]
 *     responses:
 *       204:
 *         description: 이미지 삭제 성공
 *       400:
 *         description: 잘못된 요청 (publicIds 배열이 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "publicIds 배열이 필요합니다."
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
router.delete('/delete', asyncHandler(commonImagesController.deleteImages));

export default router;
