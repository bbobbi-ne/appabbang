import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as deliveryMethodController from '@/controllers/delivery-method.controller';
import {
  createDeliveryMethodValidator,
  updateDeliveryMethodValidator,
} from '@/middlewares/validators/validate';
import { validate } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /delivery-methods:
 *   get:
 *     summary: 배송 방법 목록 조회
 *     description: 배송 방법 목록을 조회합니다. 쿼리 파라미터가 있으면 deliveryTypeName이 포함됩니다.
 *     tags: [Delivery Methods]
 *     responses:
 *       200:
 *         description: 배송 방법 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 배송 방법 번호
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 배송 방법 이름
 *                     example: "우체국"
 *                   memo:
 *                     type: string
 *                     description: 메모
 *                     example: "1-2일 소요"
 *                   fee:
 *                     type: integer
 *                     description: 배송비
 *                     example: 3000
 *                   isActive:
 *                     type: boolean
 *                     description: 활성화 여부
 *                     example: true
 *                   deliveryType:
 *                     type: string
 *                     description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                     example: "10"
 *                   deliveryTypeName:
 *                     type: string
 *                     description: "배송 타입 이름 (쿼리 파라미터가 있을 때만 포함)"
 *                     example: "택배배송"
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
router.get('/', asyncHandler(deliveryMethodController.getList));

/**
 * @swagger
 * /delivery-methods/active:
 *   get:
 *     summary: 활성화된 배송 방법 목록 조회
 *     description: 활성화된 배송 방법만 조회합니다.
 *     tags: [Delivery Methods]
 *     responses:
 *       200:
 *         description: 활성화된 배송 방법 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 배송 방법 번호
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 배송 방법 이름
 *                     example: "우체국"
 *                   memo:
 *                     type: string
 *                     description: 메모
 *                     example: "1-2일 소요"
 *                   fee:
 *                     type: integer
 *                     description: 배송비
 *                     example: 3000
 *                   isActive:
 *                     type: boolean
 *                     description: 활성화 여부
 *                     example: true
 *                   deliveryType:
 *                     type: string
 *                     description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                     example: "10"
 *                   deliveryTypeName:
 *                     type: string
 *                     description: "배송 타입 이름"
 *                     example: "택배배송"
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
router.get('/active', asyncHandler(deliveryMethodController.getListByActive));

/**
 * @swagger
 * /delivery-methods/{no}:
 *   get:
 *     summary: 배송 방법 상세 조회
 *     description: 특정 배송 방법의 상세 정보를 조회합니다.
 *     tags: [Delivery Methods]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 배송 방법 번호
 *         example: 1
 *     responses:
 *       200:
 *         description: 배송 방법 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 배송 방법 번호
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: 배송 방법 이름
 *                   example: "우체국"
 *                 memo:
 *                   type: string
 *                   description: 메모
 *                   example: "1-2일 소요"
 *                 fee:
 *                   type: integer
 *                   description: 배송비
 *                   example: 3000
 *                 isActive:
 *                   type: boolean
 *                   description: 활성화 여부
 *                   example: true
 *                 deliveryType:
 *                   type: string
 *                   description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                   example: "10"
 *                 deliveryTypeName:
 *                   type: string
 *                   description: "배송 타입 이름"
 *                   example: "택배배송"
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
 *       404:
 *         description: 배송 방법을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "배송 방법을 찾을 수 없습니다."
 *                 details:
 *                   type: object
 *                   properties:
 *                     deliveryMethodNo:
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
router.get('/:no', authenticateToken, asyncHandler(deliveryMethodController.getOne));

/**
 * @swagger
 * /delivery-methods:
 *   post:
 *     summary: 배송 방법 생성
 *     description: 새로운 배송 방법을 생성합니다.
 *     tags: [Delivery Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryType
 *               - name
 *               - fee
 *               - isActive
 *             properties:
 *               deliveryType:
 *                 type: string
 *                 description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                 example: "10"
 *               name:
 *                 type: string
 *                 description: 배송 방법 이름
 *                 example: "우체국"
 *               fee:
 *                 type: integer
 *                 description: 배송비
 *                 example: 3000
 *               isActive:
 *                 type: boolean
 *                 description: 활성화 여부
 *                 example: true
 *     responses:
 *       201:
 *         description: 배송 방법 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 생성된 배송 방법 번호
 *                   example: 1
 *                 deliveryType:
 *                   type: string
 *                   description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                   example: "10"
 *                 name:
 *                   type: string
 *                   description: 배송 방법 이름
 *                   example: "우체국"
 *                 fee:
 *                   type: integer
 *                   description: 배송비
 *                   example: 3000
 *                 isActive:
 *                   type: boolean
 *                   description: 활성화 여부
 *                   example: true
 *       500:
 *         description: 서버 오류
 */
router.post(
  '/',
  validate(createDeliveryMethodValidator),
  asyncHandler(deliveryMethodController.create),
);

/**
 * @swagger
 * /delivery-methods/{no}:
 *   put:
 *     summary: 배송 방법 수정
 *     description: 기존 배송 방법의 정보를 수정합니다.
 *     tags: [Delivery Methods]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 배송 방법 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryType
 *               - name
 *               - fee
 *               - isActive
 *             properties:
 *               deliveryType:
 *                 type: string
 *                 description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                 example: "10"
 *               name:
 *                 type: string
 *                 description: 배송 방법 이름
 *                 example: "우체국"
 *               fee:
 *                 type: integer
 *                 description: 배송비
 *                 example: 3000
 *               isActive:
 *                 type: boolean
 *                 description: 활성화 여부
 *                 example: true
 *     responses:
 *       200:
 *         description: 배송 방법 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 배송 방법 번호
 *                   example: 1
 *                 deliveryType:
 *                   type: string
 *                   description: "배송 타입 (10-택배배송, 20-직접수령, 90-기타)"
 *                   example: "10"
 *                 name:
 *                   type: string
 *                   description: 배송 방법 이름
 *                   example: "우체국"
 *                 fee:
 *                   type: integer
 *                   description: 배송비
 *                   example: 3000
 *                 isActive:
 *                   type: boolean
 *                   description: 활성화 여부
 *                   example: true
 *       400:
 *         description: 잘못된 요청 (배송 방법 번호 누락)
 *       500:
 *         description: 서버 오류
 */
router.put(
  '/:no',
  validate(updateDeliveryMethodValidator),
  asyncHandler(deliveryMethodController.update),
);

/**
 * @swagger
 * /delivery-methods/{no}:
 *   delete:
 *     summary: 배송 방법 삭제
 *     description: 특정 배송 방법을 삭제합니다.
 *     tags: [Delivery Methods]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 배송 방법 번호
 *         example: 1
 *     responses:
 *       204:
 *         description: 배송 방법 삭제 성공
 *       400:
 *         description: 잘못된 요청 (배송 방법 번호 누락)
 *       500:
 *         description: 서버 오류
 */
router.delete('/:no', authenticateToken, asyncHandler(deliveryMethodController.remove));

export default router;
