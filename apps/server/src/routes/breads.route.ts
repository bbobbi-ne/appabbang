import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as breadsController from '@/controllers/bread.controller';
import {
  createBreadValidator,
  deleteBreadValidator,
  deleteImageValidator,
  getBreadValidator,
  updateBreadStatusValidator,
  updateBreadValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /breads:
 *   get:
 *     summary: 빵 목록 조회
 *     description: 빵 목록을 조회합니다. breadStatus 쿼리 파라미터로 상태별 필터링이 가능합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: breadStatus
 *         schema:
 *           type: string
 *         description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *         example: "10"
 *     responses:
 *       200:
 *         description: 빵 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 빵 번호
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 빵 이름
 *                     example: "크로아상"
 *                   description:
 *                     type: string
 *                     description: 빵 설명
 *                     example: "바삭한 크로아상"
 *                   unitPrice:
 *                     type: integer
 *                     description: 단가
 *                     example: 3000
 *                   breadStatus:
 *                     type: string
 *                     description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                     example: "10"
 *                   breadStatusName:
 *                     type: string
 *                     description: "빵 상태 이름"
 *                     example: "판매"
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
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           description: 이미지 URL
 *                           example: "https://example.com/image.jpg"
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
router.get(
  '/',
  // authenticateToken,
  validate(getBreadValidator),
  asyncHandler(breadsController.getBreads),
);

/**
 * @swagger
 * /breads/{no}:
 *   get:
 *     summary: 빵 상세 조회
 *     description: 특정 빵의 상세 정보를 조회합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 빵 번호
 *         example: 1
 *     responses:
 *       200:
 *         description: 빵 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 빵 번호
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: 빵 이름
 *                   example: "크로아상"
 *                 description:
 *                   type: string
 *                   description: 빵 설명
 *                   example: "바삭한 크로아상"
 *                 unitPrice:
 *                   type: integer
 *                   description: 단가
 *                   example: 3000
 *                 breadStatus:
 *                   type: string
 *                   description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                   example: "10"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: "생성일시"
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: "수정일시"
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       publicId:
 *                         type: string
 *                         description: 이미지 공개 ID
 *                         example: "bread_123"
 *                       url:
 *                         type: string
 *                         description: 이미지 URL
 *                         example: "https://example.com/image.jpg"
 *                       name:
 *                         type: string
 *                         description: 원본 파일명
 *                         example: "croissant.jpg"
 *                       order:
 *                         type: integer
 *                         description: 이미지 순서
 *                         example: 1
 *       400:
 *         description: 잘못된 요청 (no 파라미터 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "no는 필수입니다."
 *                 details:
 *                   type: object
 *                   properties:
 *                     param:
 *                       type: string
 *                       example: "no"
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
 *         description: 빵을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "빵을 찾을 수 없습니다."
 *                 details:
 *                   type: object
 *                   properties:
 *                     breadNo:
 *                       type: integer
 *                       example: 999
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
router.get('/:no', authenticateToken, asyncHandler(breadsController.getBreadByNo));

/**
 * @swagger
 * /breads:
 *   post:
 *     summary: 빵 등록
 *     description: 새로운 빵을 등록합니다. 이미지 업로드가 선택적으로 가능합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unitPrice
 *               - breadStatus
 *             properties:
 *               name:
 *                 type: string
 *                 description: 빵 이름
 *                 example: "크로아상"
 *               description:
 *                 type: string
 *                 description: 빵 설명
 *                 example: "바삭한 크로아상"
 *               unitPrice:
 *                 type: integer
 *                 description: 단가
 *                 example: 3000
 *               breadStatus:
 *                 type: string
 *                 enum: ['10', '20', '30', '40', '50']
 *                 description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                 example: "10"
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 빵 이미지 (선택사항)
 *     responses:
 *       201:
 *         description: 빵 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 생성된 빵 번호
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: 빵 이름
 *                   example: "크로아상"
 *                 description:
 *                   type: string
 *                   description: 빵 설명
 *                   example: "바삭한 크로아상"
 *                 unitPrice:
 *                   type: integer
 *                   description: 단가
 *                   example: 3000
 *                 breadStatus:
 *                   type: string
 *                   description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                   example: "10"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post(
  '/',
  authenticateToken,
  validate(createBreadValidator),
  asyncHandler(breadsController.createBread),
);

/**
 * @swagger
 * /breads/{no}:
 *   put:
 *     summary: 빵 수정
 *     description: 기존 빵의 정보를 수정합니다. 이미지 업로드가 선택적으로 가능합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 빵 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unitPrice
 *               - breadStatus
 *             properties:
 *               name:
 *                 type: string
 *                 description: 빵 이름
 *                 example: "크로아상"
 *               description:
 *                 type: string
 *                 description: 빵 설명
 *                 example: "바삭한 크로아상"
 *               unitPrice:
 *                 type: integer
 *                 description: 단가
 *                 example: 3000
 *               breadStatus:
 *                 type: string
 *                 enum: ['10', '20', '30', '40', '50']
 *                 description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                 example: "10"
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 빵 이미지 (선택사항)
 *     responses:
 *       200:
 *         description: 빵 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 빵 번호
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: 빵 이름
 *                   example: "크로아상"
 *                 description:
 *                   type: string
 *                   description: 빵 설명
 *                   example: "바삭한 크로아상"
 *                 unitPrice:
 *                   type: integer
 *                   description: 단가
 *                   example: 3000
 *                 breadStatus:
 *                   type: string
 *                   description: "빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                   example: "10"
 *       400:
 *         description: 잘못된 요청 (no 파라미터 누락)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 빵을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put(
  '/:no',
  authenticateToken,
  validate(updateBreadValidator),
  asyncHandler(breadsController.updateBread),
);

/**
 * @swagger
 * /breads/{no}/status:
 *   put:
 *     summary: 빵 상태 수정
 *     description: 빵의 상태만 수정합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 빵 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - breadStatus
 *             properties:
 *               breadStatus:
 *                 type: string
 *                 enum: ['10', '20', '30', '40', '50']
 *                 description: "변경할 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                 example: "10"
 *     responses:
 *       200:
 *         description: 빵 상태 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 빵 번호
 *                   example: 1
 *                 breadStatus:
 *                   type: string
 *                   description: "변경된 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)"
 *                   example: "10"
 *       400:
 *         description: 잘못된 요청 (no 파라미터 누락)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 빵을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put(
  '/:no/status',
  authenticateToken,
  validate(updateBreadStatusValidator),
  asyncHandler(breadsController.updateBreadStatus),
);

/**
 * @swagger
 * /breads:
 *   delete:
 *     summary: 빵 삭제 (여러건)
 *     description: 여러 빵을 한 번에 삭제합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noList
 *             properties:
 *               noList:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 삭제할 빵 번호 목록
 *                 example: [1, 2, 3]
 *     responses:
 *       204:
 *         description: 빵 삭제 성공
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.delete(
  '/',
  authenticateToken,
  validate(deleteBreadValidator),
  asyncHandler(breadsController.deleteBread),
);

/**
 * @swagger
 * /breads/image:
 *   delete:
 *     summary: 빵 이미지 삭제
 *     description: 특정 빵의 이미지를 삭제합니다.
 *     tags: [Breads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 description: 삭제할 이미지의 공개 ID
 *                 example: "breads/image123"
 *     responses:
 *       204:
 *         description: 이미지 삭제 성공
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.delete(
  '/image',
  authenticateToken,
  validate(deleteImageValidator),
  asyncHandler(breadsController.deleteImage),
);

export default router;
