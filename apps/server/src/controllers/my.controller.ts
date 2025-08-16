import { Request, Response } from 'express';
import * as myService from '@/services/my.service';
import { AppError } from '@/types';
import { comparePassword, hashPassword } from '@/services/auth.service';

/** 내 정보 상세조회 */
export const getInfo = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('고객정보를 조회할 수 없습니다.');

  // 고객 상세정보 조회 + 고객 보유 쿠폰 조회
  const { customer, coupon } = await myService.getMyInfo(req.user.no);
  const totalAmount = await myService.getOrderAccumulatedAmount(req.user.no);
  res.status(200).json({ customer, coupon, totalAmount });
};

/** 내 정보 수정 */
export const update = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  // 고객 정보 조회
  const findCustomer = await myService.getMyInfo(req.user.no);
  if (!findCustomer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  const customer = await myService.update(req.body);
  res.status(200).json({ customer });
};

/** 내 정보 수정 : 비밀번호 변경 */
export const updatePw = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  const { no, id } = req.user;
  const { pw, pwModify } = req.body;

  // 고객 정보 조회
  const customer = await myService.getMyInfoDetail(id);
  if (!customer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  // 비밀번호 비교
  const isValid = await comparePassword(pw, customer.pw);
  if (!isValid) throw AppError.internalServerError('현재 비밀번호가 올바르지 않습니다.');

  // 비밀번호 해싱
  const hashedPw = await hashPassword(pwModify);

  // 비밀번호 변경
  await myService.updatePw(no, hashedPw);
  res.status(200).json();
};

// >>>>>> 배송지 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** 내 배송지 목록 조회 */
export const getAddressList = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const list = await myService.getAddressList(customerNo);
  res.status(200).json(list);
};

/** 내 배송지 상세 조회 */
export const getAddressOne = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;
  const one = await myService.getAddressOne(Number(no), customerNo);
  res.status(200).json(one);
};

/** 내 배송지 등록 */
export const createAddress = async (req: Request, res: Response) => {
  const customerNo = req.user.no;
  const { address, addressDetail, zipcode, message, recipientName, recipientMobile, isDefault } =
    req.body;

  await myService.createAddress(
    customerNo,
    {
      address,
      addressDetail,
      zipcode,
      message,
      recipientName,
      recipientMobile,
    },
    isDefault,
  );

  res.sendStatus(201);
};

/** 내 배송지 수정 */
export const updateAddress = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;
  const { address, addressDetail, zipcode, message, recipientName, recipientMobile, isDefault } =
    req.body;

  await myService.updateAddress(
    Number(no),
    customerNo,
    {
      address,
      addressDetail,
      zipcode,
      message,
      recipientName,
      recipientMobile,
    },
    isDefault,
  );

  res.sendStatus(200);
};

/** 내 배송지 삭제 */
export const removeAddress = async (req: Request, res: Response) => {
  const no = req.params.no;
  const customerNo = req.user.no;

  await myService.deleteAddress(Number(no), customerNo);

  res.sendStatus(204);
};
