import { Router } from 'express';
// import { authenticateToken } from '@/middlewares/auth.middleware';
import * as orderController from '@/controllers/order.controller';
import {
  createOrderValidator,
  updateOrderValidator,
  validate,
} from '@/middlewares/validators/validate';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: 주문 목록 조회
 *     description: 모든 주문 목록을 조회합니다.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 주문 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   no:
 *                     type: integer
 *                     description: 주문 번호
 *                     example: 1
 *                   customerNo:
 *                     type: integer
 *                     description: 고객 번호
 *                     example: 1
 *                   addressNo:
 *                     type: integer
 *                     description: 주소 번호
 *                     example: 1
 *                   deliveryMethodNo:
 *                     type: integer
 *                     description: 배송 방법 번호
 *                     example: 1
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *                     description: 주문 날짜
 *                     example: "2024-01-15T10:30:00Z"
 *                   deliveryDate:
 *                     type: string
 *                     format: date-time
 *                     description: 배송 날짜
 *                     example: "2024-01-16T10:30:00Z"
 *                   status:
 *                     type: string
 *                     description: "주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)"
 *                     example: "10"
 *                   totalAmount:
 *                     type: number
 *                     description: 총 금액
 *                     example: 25000
 *       500:
 *         description: 서버 오류
 */
router.get('/', asyncHandler(orderController.getList));

/**
 * @swagger
 * /orders/{no}:
 *   get:
 *     summary: 주문 상세 조회
 *     description: 특정 주문의 상세 정보를 조회합니다.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 번호
 *         example: 1
 *     responses:
 *       200:
 *         description: 주문 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 주문 번호
 *                   example: 1
 *                 customerNo:
 *                   type: integer
 *                   description: 고객 번호
 *                   example: 1
 *                 addressNo:
 *                   type: integer
 *                   description: 주소 번호
 *                   example: 1
 *                 deliveryMethodNo:
 *                   type: integer
 *                   description: 배송 방법 번호
 *                   example: 1
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   description: 주문 날짜
 *                   example: "2024-01-15T10:30:00Z"
 *                 deliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: 배송 날짜
 *                   example: "2024-01-16T10:30:00Z"
 *                 status:
 *                   type: string
 *                   description: "주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)"
 *                   example: "10"
 *                 totalAmount:
 *                   type: number
 *                   description: 총 금액
 *                   example: 25000
 *       400:
 *         description: 잘못된 요청 (주문 번호 누락)
 *       404:
 *         description: 주문을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:no', asyncHandler(orderController.getOne));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: 주문 생성 (비회원)
 *     description: 비회원 주문을 생성합니다.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobileNumber
 *               - address
 *               - addressDetail
 *               - zipcode
 *               - recipientName
 *               - recipientMobile
 *               - orderItems
 *               - deliveryMethodNo
 *               - orderPw
 *               - totalPrice
 *             properties:
 *               name:
 *                 type: string
 *                 description: 고객명
 *                 example: "홍길동"
 *               mobileNumber:
 *                 type: string
 *                 description: 전화번호
 *                 example: "010-1234-5678"
 *               address:
 *                 type: string
 *                 description: 주소
 *                 example: "서울시 강남구"
 *               addressDetail:
 *                 type: string
 *                 description: 상세주소
 *                 example: "123-45"
 *               zipcode:
 *                 type: string
 *                 description: 우편번호
 *                 example: "12345"
 *               message:
 *                 type: string
 *                 description: 배송 메시지
 *                 example: "문 앞에 놓아주세요"
 *               recipientName:
 *                 type: string
 *                 description: 수령인 이름
 *                 example: "홍길동"
 *               recipientMobile:
 *                 type: string
 *                 description: 수령인 전화번호
 *                 example: "010-1234-5678"
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - breadNo
 *                     - quantity
 *                   properties:
 *                     breadNo:
 *                       type: integer
 *                       description: 빵 번호
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       description: 수량
 *                       example: 2
 *               deliveryMethodNo:
 *                 type: integer
 *                 description: 배송 방법 번호
 *                 example: 1
 *               orderPw:
 *                 type: string
 *                 description: 주문 비밀번호
 *                 example: "1234"
 *               totalPrice:
 *                 type: integer
 *                 description: 총 주문 금액
 *                 example: 15000
 *     responses:
 *       201:
 *         description: 주문 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderNumber:
 *                   type: string
 *                   description: 주문번호
 *                   example: "ORD-20240622-12345678"
 *                 name:
 *                   type: string
 *                   description: 고객명
 *                   example: "홍길동"
 *                 mobileNumber:
 *                   type: string
 *                   description: 전화번호
 *                   example: "010-1234-5678"
 *                 address:
 *                   type: string
 *                   description: 주소
 *                   example: "서울시 강남구"
 *                 addressDetail:
 *                   type: string
 *                   description: 상세주소
 *                   example: "123-45"
 *                 zipcode:
 *                   type: string
 *                   description: 우편번호
 *                   example: "12345"
 *                 message:
 *                   type: string
 *                   description: 배송 메시지
 *                   example: "문 앞에 놓아주세요"
 *                 recipientName:
 *                   type: string
 *                   description: 수령인 이름
 *                   example: "홍길동"
 *                 recipientMobile:
 *                   type: string
 *                   description: 수령인 전화번호
 *                   example: "010-1234-5678"
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       breadNo:
 *                         type: integer
 *                         description: 빵 번호
 *                         example: 1
 *                       quantity:
 *                         type: integer
 *                         description: 수량
 *                         example: 2
 *                 deliveryMethodNo:
 *                   type: integer
 *                   description: 배송 방법 번호
 *                   example: 1
 *                 orderPw:
 *                   type: string
 *                   description: 주문 비밀번호 (해시된 값)
 *                   example: "$2b$10$..."
 *                 totalPrice:
 *                   type: integer
 *                   description: 총 주문 금액
 *                   example: 15000
 *       400:
 *         description: 잘못된 요청 (주문 금액 불일치 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "주문 금액이 일치하지 않습니다."
 *                 details:
 *                   type: object
 *                   properties:
 *                     expectedTotal:
 *                       type: integer
 *                       example: 15000
 *                     receivedTotal:
 *                       type: integer
 *                       example: 14000
 *                     originalPrice:
 *                       type: integer
 *                       example: 16000
 *                     discountAmount:
 *                       type: integer
 *                       example: 1000
 *                     deliveryFee:
 *                       type: integer
 *                       example: 0
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
router.post('/', validate(createOrderValidator), asyncHandler(orderController.create));

/**
 * @swagger
 * /orders/{no}:
 *   put:
 *     summary: 주문 수정
 *     description: 기존 주문의 정보를 수정합니다.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 번호
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressNo
 *               - deliveryMethodNo
 *               - deliveryDate
 *               - totalAmount
 *             properties:
 *               addressNo:
 *                 type: integer
 *                 description: 주소 번호
 *                 example: 1
 *               deliveryMethodNo:
 *                 type: integer
 *                 description: 배송 방법 번호
 *                 example: 1
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *                 description: 배송 날짜
 *                 example: "2024-01-16T10:30:00Z"
 *               totalAmount:
 *                 type: number
 *                 description: 총 금액
 *                 example: 25000
 *     responses:
 *       200:
 *         description: 주문 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 no:
 *                   type: integer
 *                   description: 주문 번호
 *                   example: 1
 *                 customerNo:
 *                   type: integer
 *                   description: 고객 번호
 *                   example: 1
 *                 addressNo:
 *                   type: integer
 *                   description: 주소 번호
 *                   example: 1
 *                 deliveryMethodNo:
 *                   type: integer
 *                   description: 배송 방법 번호
 *                   example: 1
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   description: 주문 날짜
 *                   example: "2024-01-15T10:30:00Z"
 *                 deliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: 배송 날짜
 *                   example: "2024-01-16T10:30:00Z"
 *                 status:
 *                   type: string
 *                   description: "주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)"
 *                   example: "10"
 *                 totalAmount:
 *                   type: number
 *                   description: 총 금액
 *                   example: 25000
 *       400:
 *         description: 잘못된 요청 (주문 번호 누락)
 *       500:
 *         description: 서버 오류
 */
router.put('/:no', validate(updateOrderValidator), asyncHandler(orderController.update));

/**
 * @swagger
 * /orders/{no}:
 *   delete:
 *     summary: 주문 삭제
 *     description: 특정 주문을 삭제합니다.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: no
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 번호
 *         example: 1
 *     responses:
 *       204:
 *         description: 주문 삭제 성공
 *       400:
 *         description: 잘못된 요청 (주문 번호 누락)
 *       500:
 *         description: 서버 오류
 */
router.delete('/:no', asyncHandler(orderController.remove));

export default router;
