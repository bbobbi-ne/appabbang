import { Router } from 'express';
import * as addressController from '@/controllers/address.controller';
import { updateAddressValidator, validate } from '@/middlewares/validators/validate';
import { createAddressValidator } from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /address:
 *   get:
 *     summary: 주소 목록 조회
 *     description: 모든 주소 목록을 조회합니다.
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: 주소 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 주소 번호
 *                     example: 1
 *                   customerNo:
 *                     type: integer
 *                     description: 고객 번호
 *                     example: 1
 *                   address:
 *                     type: string
 *                     description: 주소
 *                     example: "서울시 강남구 테헤란로 123"
 *                   addressDetail:
 *                     type: string
 *                     description: 상세주소
 *                     example: "456동 789호"
 *                   zipcode:
 *                     type: string
 *                     description: 우편번호
 *                     example: "06123"
 *                   recipientName:
 *                     type: string
 *                     description: 수령인 이름
 *                     example: "홍길동"
 *                   recipientMobile:
 *                     type: string
 *                     description: 수령인 휴대폰 번호
 *                     example: "010-1234-5678"
 *                   message:
 *                     type: string
 *                     description: 배송 메시지
 *                     example: "문 앞에 놓아주세요"
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
 */
router.get('/', asyncHandler(addressController.getList));

/**
 * @swagger
 * /address/{no}:
 *   get:
 *     summary: 주소 상세 조회
 *     description: 특정 주소의 상세 정보를 조회합니다.
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 번호
 *         example: 1
 *     responses:
 *       200:
 *         description: 주소 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 주소 번호
 *                   example: 1
 *                 customerNo:
 *                   type: integer
 *                   description: 고객 번호
 *                   example: 1
 *                 address:
 *                   type: string
 *                   description: 주소
 *                   example: "서울시 강남구 테헤란로 123"
 *                 addressDetail:
 *                   type: string
 *                   description: 상세주소
 *                   example: "456동 789호"
 *                 zipcode:
 *                   type: string
 *                   description: 우편번호
 *                   example: "06123"
 *                 recipientName:
 *                   type: string
 *                   description: 수령인 이름
 *                   example: "홍길동"
 *                 recipientMobile:
 *                   type: string
 *                   description: 수령인 휴대폰 번호
 *                   example: "010-1234-5678"
 *                 message:
 *                   type: string
 *                   description: 배송 메시지
 *                   example: "문 앞에 놓아주세요"
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
 *       400:
 *         description: 잘못된 요청 (주소 번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address no is required"
 *       404:
 *         description: 주소를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address not found"
 *       500:
 *         description: 서버 오류
 */
router.get('/:no', asyncHandler(addressController.getOne));

/**
 * @swagger
 * /address:
 *   post:
 *     summary: 주소 생성
 *     description: 새로운 주소를 생성합니다. 고객이 있어야 주소를 생성할 수 있습니다.
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerNo
 *               - address
 *               - addressDetail
 *               - zipcode
 *               - recipientName
 *               - recipientMobile
 *             properties:
 *               customerNo:
 *                 type: integer
 *                 description: 고객 번호
 *                 example: 1
 *               address:
 *                 type: string
 *                 description: 주소
 *                 example: "서울시 강남구 테헤란로 123"
 *               addressDetail:
 *                 type: string
 *                 description: 상세주소
 *                 example: "456동 789호"
 *               zipcode:
 *                 type: string
 *                 description: 우편번호
 *                 example: "06123"
 *               recipientName:
 *                 type: string
 *                 description: 수령인 이름
 *                 example: "홍길동"
 *               recipientMobile:
 *                 type: string
 *                 description: 수령인 휴대폰 번호
 *                 example: "010-1234-5678"
 *               message:
 *                 type: string
 *                 description: 배송 메시지 (선택사항)
 *                 example: "문 앞에 놓아주세요"
 *     responses:
 *       201:
 *         description: 주소 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 생성된 주소 번호
 *                   example: 1
 *                 customerNo:
 *                   type: integer
 *                   description: 고객 번호
 *                   example: 1
 *                 address:
 *                   type: string
 *                   description: 주소
 *                   example: "서울시 강남구 테헤란로 123"
 *                 addressDetail:
 *                   type: string
 *                   description: 상세주소
 *                   example: "456동 789호"
 *                 zipcode:
 *                   type: string
 *                   description: 우편번호
 *                   example: "06123"
 *                 recipientName:
 *                   type: string
 *                   description: 수령인 이름
 *                   example: "홍길동"
 *                 recipientMobile:
 *                   type: string
 *                   description: 수령인 휴대폰 번호
 *                   example: "010-1234-5678"
 *                 message:
 *                   type: string
 *                   description: 배송 메시지
 *                   example: "문 앞에 놓아주세요"
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
router.post('/', validate(createAddressValidator), asyncHandler(addressController.create));

/**
 * @swagger
 * /address/{no}:
 *   put:
 *     summary: 주소 수정
 *     description: "기존 주소의 정보를 수정합니다. (TODO- 본인만 수정 가능하도록 개선 예정)"
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - addressDetail
 *               - zipcode
 *               - recipientName
 *               - recipientMobile
 *             properties:
 *               address:
 *                 type: string
 *                 description: 주소
 *                 example: "서울시 강남구 테헤란로 123"
 *               addressDetail:
 *                 type: string
 *                 description: 상세주소
 *                 example: "456동 789호"
 *               zipcode:
 *                 type: string
 *                 description: 우편번호
 *                 example: "06123"
 *               recipientName:
 *                 type: string
 *                 description: 수령인 이름
 *                 example: "홍길동"
 *               recipientMobile:
 *                 type: string
 *                 description: 수령인 휴대폰 번호
 *                 example: "010-1234-5678"
 *               message:
 *                 type: string
 *                 description: 배송 메시지 (선택사항)
 *                 example: "문 앞에 놓아주세요"
 *     responses:
 *       200:
 *         description: 주소 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 주소 번호
 *                   example: 1
 *                 customerNo:
 *                   type: integer
 *                   description: 고객 번호
 *                   example: 1
 *                 address:
 *                   type: string
 *                   description: 주소
 *                   example: "서울시 강남구 테헤란로 123"
 *                 addressDetail:
 *                   type: string
 *                   description: 상세주소
 *                   example: "456동 789호"
 *                 zipcode:
 *                   type: string
 *                   description: 우편번호
 *                   example: "06123"
 *                 recipientName:
 *                   type: string
 *                   description: 수령인 이름
 *                   example: "홍길동"
 *                 recipientMobile:
 *                   type: string
 *                   description: 수령인 휴대폰 번호
 *                   example: "010-1234-5678"
 *                 message:
 *                   type: string
 *                   description: 배송 메시지
 *                   example: "문 앞에 놓아주세요"
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
 *       400:
 *         description: 잘못된 요청 (주소 번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address no is required"
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
router.put('/:no', validate(updateAddressValidator), asyncHandler(addressController.update));

/**
 * @swagger
 * /address/{no}:
 *   delete:
 *     summary: 주소 삭제
 *     description: "특정 주소를 삭제합니다. (TODO- 본인만 삭제 가능하도록 개선 예정)"
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 번호
 *         example: 1
 *     responses:
 *       204:
 *         description: 주소 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address deleted successfully"
 *       400:
 *         description: 잘못된 요청 (주소 번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address no is required"
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
router.delete('/:no', asyncHandler(addressController.remove));

export default router;
