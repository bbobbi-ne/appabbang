import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import {
  createCommonCodeValidator,
  createCommonCodeValidator as updateCommonCodeValidator,
  validate,
} from '@/middlewares/validators/validate';
import * as commonCodeController from '@/controllers/common-code.controller';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /common-code:
 *   get:
 *     summary: 공통 코드 목록 조회
 *     description: 모든 공통 코드 목록을 조회합니다. 최대 1000개까지 조회 가능합니다.
 *     tags: [Common Code]
 *     responses:
 *       200:
 *         description: 공통 코드 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 코드 번호
 *                     example: 1
 *                   groupName:
 *                     type: string
 *                     description: 코드 그룹명
 *                     example: "delivery_type"
 *                   code:
 *                     type: string
 *                     description: 코드값
 *                     example: "10"
 *                   name:
 *                     type: string
 *                     description: 코드명
 *                     example: "택배"
 *                   remarkTxt:
 *                     type: string
 *                     description: 비고
 *                     example: "택배 배송"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: "생성일시"
 *                     example: "2024-01-01T00:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: "수정일시"
 *                     example: "2024-01-01T00:00:00.000Z"
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
router.get('/', asyncHandler(commonCodeController.getCommonCode));

/**
 * @swagger
 * /common-code/{groupName}:
 *   get:
 *     summary: 공통 코드 그룹별 조회
 *     description: 특정 그룹의 공통 코드만 조회합니다.
 *     tags: [Common Code]
 *     parameters:
 *       - in: path
 *         name: groupName
 *         required: true
 *         schema:
 *           type: string
 *         description: 코드 그룹명
 *         example: "delivery_type"
 *     responses:
 *       200:
 *         description: 공통 코드 그룹별 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: 코드값
 *                     example: "10"
 *                   name:
 *                     type: string
 *                     description: 코드명
 *                     example: "택배"
 *       400:
 *         description: 유효하지 않은 코드 그룹명
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "'INVALID_GROUP'은(는) 유효하지 않은 코드 그룹입니다. (그룹명: bread_status, user_role, material_type, order_status, purchase_status, delivery_type)"
 *                 details:
 *                   type: object
 *                   properties:
 *                     invalidGroupName:
 *                       type: string
 *                       example: "INVALID_GROUP"
 *                     validGroupNames:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["bread_status", "user_role", "delivery_type"]
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
router.get('/:groupName', asyncHandler(commonCodeController.getCommonCodeByGroupName));

/**
 * @swagger
 * /common-code:
 *   post:
 *     summary: 공통 코드 생성 (관리자 전용)
 *     description: 새로운 공통 코드를 생성합니다.
 *     tags: [Common Code]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - groupName
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: 코드값
 *                 example: "10"
 *               groupName:
 *                 type: string
 *                 description: 코드 그룹명
 *                 example: "delivery_type"
 *               name:
 *                 type: string
 *                 description: 코드명
 *                 example: "택배"
 *               remarkTxt:
 *                 type: string
 *                 description: 비고 (선택사항)
 *                 example: "1-2일 소요"
 *     responses:
 *       201:
 *         description: 공통 코드 생성 성공
 *       401:
 *         description: 인증 실패
 */
router.post(
  '/',
  authenticateToken,
  validate(createCommonCodeValidator),
  asyncHandler(commonCodeController.createCommonCode),
);

/**
 * @swagger
 * /common-code/{no}:
 *   put:
 *     summary: 공통 코드 수정 (관리자 전용)
 *     description: 기존 공통 코드의 정보를 수정합니다.
 *     tags: [Common Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 공통 코드 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - groupName
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: 코드값
 *                 example: "10"
 *               groupName:
 *                 type: string
 *                 description: 코드 그룹명
 *                 example: "delivery_type"
 *               name:
 *                 type: string
 *                 description: 코드명
 *                 example: "택배"
 *               remarkTxt:
 *                 type: string
 *                 description: 비고 (선택사항)
 *                 example: "1-2일 소요"
 *     responses:
 *       200:
 *         description: 공통 코드 수정 성공
 *       400:
 *         description: 잘못된 요청 (번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "no 는 필수입니다"
 *       401:
 *         description: 인증 실패
 */
router.put(
  '/:no',
  authenticateToken,
  validate(updateCommonCodeValidator),
  asyncHandler(commonCodeController.updateCommonCode),
);

/**
 * @swagger
 * /common-code/{no}:
 *   delete:
 *     summary: 공통 코드 삭제 (관리자 전용)
 *     description: 특정 공통 코드를 삭제합니다.
 *     tags: [Common Code]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 공통 코드 번호
 *         example: 1
 *     responses:
 *       204:
 *         description: 공통 코드 삭제 성공
 *       400:
 *         description: 잘못된 요청 (번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "no 는 필수입니다"
 *       401:
 *         description: 인증 실패
 */
router.delete('/:no', authenticateToken, asyncHandler(commonCodeController.deleteCommonCode));

export default router;
