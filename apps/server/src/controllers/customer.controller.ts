import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/services/auth.service';
import { AppError } from '@/types';
import { ClientPayload } from '@/types/client-payload';
import { Request, Response } from 'express';
import * as customerService from '@/services/customer.service';
import { sendEmail } from '@/lib/send-email-code';

export const getList = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getListAll = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getOne = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};

/** 회원가입 (고객) */
export const create = async (req: Request, res: Response) => {
  const {
    id,
    name,
    email,
    pw,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    isMarketingTermsAgreed,
  } = req.body;

  // 중복계정 확인
  const findCustomer = await customerService.getOneForCheck(id);
  if (findCustomer) throw AppError.conflict('이미 존재하는 아이디입니다.');

  const model = {
    id,
    name,
    email,
    pw,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    isMarketingTermsAgreed,
  };

  // 고객, 배송지, 고객-쿠폰 저장
  const customer = await customerService.createCustomerInfo(model);

  // JWT 토큰 발급
  const payload = { ...customer, type: 'customer' };
  const accessToken = generateAccessToken(payload as ClientPayload);
  const refreshToken = generateRefreshToken(payload as ClientPayload);

  // cookie 설정
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // 고객 RefreshToken 정보 업데이트
  await customerService.updateRefreshToken(customer.id, refreshToken);

  // 결과값 전송
  const result = {
    data: customer,
    accessToken,
  };

  res.status(201).json(result);
};

export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const remove = async (_: Request, res: Response) => {
  res.status(204).json('Hello World');
};

/** 이메일로 인증코드 보내기 */
export const sendEmailCode = async (req: Request, res: Response) => {
  const code = await sendEmail(req.body.email);
  res.status(200).json({ code });
};

/** 이메일 조회 */
export const getEmail = async (req: Request, res: Response) => {
  if (!req.body.email)
    throw AppError.badRequest('이메일 조회 과정에서 오류가 발생했습니다. (이메일 누락)');

  const email = await customerService.getEmail(req.query.email as string);
  res.status(200).json({ email });
};

/** 이메일로 아이디 조회 */
export const getId = async (req: Request, res: Response) => {
  const id = await customerService.getId(req.body.email);
  res.status(200).json({ id });
};
