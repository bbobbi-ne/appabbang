import { Request, Response } from 'express';
import * as OrderService from '@/services/order.service';
import * as GuestService from '@/services/guest.service';
import * as paymentService from '@/services/payment.service';
import * as MyService from '@/services/my.service';
import { AppError } from '@/types';
import { comparePassword, generateTempPassword, hashPassword } from '@/services/auth.service';
import { guestOrderPwSendEmail } from '@/lib/send-email';

/** 주문 목록 조회 */
export const getList = async (_: Request, res: Response) => {
  const list = await OrderService.getList();
  res.status(200).json(list);
};

/** 주문 상세 조회 */
export const getOne = async (req: Request, res: Response) => {
  const one = await OrderService.getByNo(Number(req.params.no));
  res.status(200).json(one);
};

/** 주문 생성 (비회원, 회원) */
export const create = async (req: Request, res: Response) => {
  const user = req.user;

  // 조건이 없을땐 validate.ts 에서 처리했지만
  // 조건에 따른 필수값/옵션값 처리 여부는 아래에서 진행
  if (!user) {
    if (!req.body.orderPw) {
      throw AppError.badRequest('주문 비밀번호를 입력해주세요.');
    }

    if (!req.body.isServiceTermsAgreed) {
      throw AppError.badRequest('서비스 약관에 동의해주세요.');
    }

    if (!req.body.isPrivacyTermsAgreed) {
      throw AppError.badRequest('개인정보 수집 및 이용 약관에 동의해주세요.');
    }
  }

  if (req.body.deliveryTypeCode === '10') {
    if (!req.body.address) {
      throw AppError.badRequest('배송지를 입력해주세요.');
    }

    if (!req.body.addressDetail) {
      throw AppError.badRequest('상세 주소를 입력해주세요.');
    }

    if (!req.body.zipcode) {
      throw AppError.badRequest('우편번호를 입력해주세요.');
    }

    if (!req.body.recipientName) {
      throw AppError.badRequest('수령자 이름을 입력해주세요.');
    }

    if (!req.body.recipientMobile) {
      throw AppError.badRequest('수령자 전화번호를 입력해주세요.');
    }

    if (!req.body.message) {
      throw AppError.badRequest('메시지를 입력해주세요.');
    }
  }

  const no = await OrderService.create(user?.no, req.body);

  res.status(201).json({ no });
};

/** 주문 수정 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;

  await OrderService.update(Number(no), req.body);

  res.status(200).json({ message: '주문이 수정되었습니다.' });
};

/** 주문 송장번호 업데이트 */
export const updateTrackingNumber = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { trackingNumber } = req.body;

  await OrderService.updateTrackingNumber(Number(no), trackingNumber);

  res.status(200).json({ message: '송장번호가 업데이트되었습니다.' });
};

/** 주문 상태 수정 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { orderStatus } = req.body;

  await OrderService.update(Number(no), { orderStatus });

  const payment = await paymentService.getOneByNo(Number(no));

  // 접수요청 및 취소완료로 변경시 입금확인 false로 수정
  if (['10', '51'].includes(orderStatus)) {
    await paymentService.update(Number(no), {
      isPaid: false,
      paidConfirmedAt: null,
    });
  }

  // 접수요청,취소요청,취소완료를 제외한 상태로 변경시 입금확인 true으로 수정
  if (!['10', '51', '50'].includes(orderStatus)) {
    await paymentService.update(Number(no), {
      isPaid: true,
      paidConfirmedAt: payment?.paidConfirmedAt ?? new Date(),
    });
  }

  res.status(200).json({ message: '주문 상태가 수정되었습니다.' });
};

/** [비회원] 주문 목록 조회 */
export const getGuestOrders = async (req: Request, res: Response) => {
  const { ordererName, ordererMobile, ordererEmail, orderPw } = req.body;
  console.log();
  if (!ordererName || !ordererMobile || !ordererEmail || !orderPw)
    throw AppError.notFound('비회원 로그인 정보를 입력 바랍니다.');

  // 비회원 정보로 입력된 주문 목록 조회
  const guestOrders = await GuestService.getGuestOrders({
    ordererName,
    ordererMobile,
    ordererEmail,
  });
  const matchedOrders = new Array();

  // list 중에서 orderPw와 compare해서 일치하는 주문목록만 matchedOrders에 담기
  for (const order of guestOrders) {
    if (order.orderPw && (await comparePassword(String(orderPw), order.orderPw))) {
      matchedOrders.push(order);
    }
  }

  if (matchedOrders.length === 0) {
    throw AppError.notFound('비회원 정보와 일치하는 주문목록이 존재하지 않습니다.');
  }

  // orderPw 비교는 끝났으니 다시 리턴값에서 제외함. (보안)
  matchedOrders.forEach((item) => {
    delete item.orderPw;
  });

  res.status(200).json(matchedOrders);
};

/** [비회원] 주문취소 */
export const cancelOrder = async (req: Request, res: Response) => {
  const orderNo = Number(req.params.no);
  const { canceledReason } = req.body;

  const order = await MyService.getOrder(orderNo);
  if (!order) throw AppError.notFound('주문을 찾을 수 없습니다.');

  if (Number(order.orderStatus) !== 10 && Number(order.orderStatus) !== 11)
    throw AppError.badRequest('현재는 주문을 취소할 수 없습니다.');

  // 주문취소
  await GuestService.cancelOrder({ orderNo, canceledReason });

  res.status(200).json({ message: '주문이 취소되었습니다.' });
};

/** [비회원] 주문 비밀번호 찾기 */
export const updateGuestOrderPwSendEmail = async (req: Request, res: Response) => {
  const { ordererName, ordererMobile, ordererEmail } = req.body;
  if (!ordererName || !ordererMobile || !ordererEmail)
    throw AppError.notFound('비회원 정보가 누락되었습니다.');

  // 임시 주문 비밀번호 생성
  const orderPw = generateTempPassword();
  const hashedOrderPw = await hashPassword(orderPw);
  const params = { ...req.body, hashedOrderPw };

  await GuestService.getUpdateOrderPw(params);

  // 입력한 이메일로 메일을 전송하여 주문 비밀번호를 알려주도록 한다.
  // 비회원이므로 이메일을 굳이 인증절차를 밟을 이유는 없다.
  await guestOrderPwSendEmail({ ordererEmail, orderPw });
  res.sendStatus(200);
};
