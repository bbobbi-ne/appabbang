import { Request, Response } from 'express';
import * as OrderService from '@/services/order.service';
import { AppError } from '@/types';

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
  const {
    ordererName,
    ordererMobile,
    recipientName,
    recipientMobile,
    address,
    addressDetail,
    zipcode,
    message,
    orderRoundNo,
    totalPrice,
    trackingNumber,
    isPaymentRefundTermsAgreed,
    customerCouponNo,
    deliveryMethodNo,
    orderItems,
    bankCode,
    accountNumber,
    accountHolderName,
  } = req.body;

  const user = req.user;

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

  await OrderService.create(user?.no, {
    ordererName,
    ordererMobile,
    recipientName,
    recipientMobile,
    address,
    addressDetail,
    zipcode,
    message,
    orderRoundNo,
    totalPrice,
    trackingNumber,
    isPaymentRefundTermsAgreed,
    orderPw: req.body.orderPw,
    isServiceTermsAgreed: req.body.isServiceTermsAgreed,
    isPrivacyTermsAgreed: req.body.isPrivacyTermsAgreed,
    deliveryMethodNo,
    orderItems,
    bankCode,
    accountNumber,
    accountHolderName,
    customerCouponNo,
  });

  res.status(200).json({ message: '주문이 완료되었습니다.' });
};

/** 주문 수정 */
export const update = async (req: Request, res: Response) => {
  const { no } = req.params;

  await OrderService.update(Number(no), req.body);

  res.status(200).json({ message: '주문이 수정되었습니다.' });
};

/** 주문 상태 수정 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { no } = req.params;
  const { orderStatus } = req.body;

  await OrderService.update(Number(no), { orderStatus });

  res.status(200).json({ message: '주문 상태가 수정되었습니다.' });
};
