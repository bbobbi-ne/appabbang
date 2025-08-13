import { CookieOptions, Request, Response } from 'express';
import * as CustomerService from '@/services/customer.service';
import { AppError } from '@/types';
import bcrypt from 'bcrypt';
// import { commonCodeMap } from '@/services/common-code.service';

/** 코드 조회 */
// export function getCodeName(code: string): string {
//   return commonCodeMap.deliveryTypeMap.get(code) || '-';
// }

/**
 * RefreshToken을 Cookie에 담을 때 정보
 */
const REFRESH_COOKIE = {
  name: 'refreshToken',
  option: {
    httpOnly: true,
    sameSite: 'strict', // CSRF 방지
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
  },
};

export const getList = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getListAll = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const getOne = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};

// 비교
// console.log(await bcrypt.compare(password, hashedPassword));

/**
 * 회원가입
 */
export const create = async (req: Request, res: Response) => {
  const {
    id,
    name,
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
  const findCustomer = await CustomerService.getByIdForLogin(id);
  if (findCustomer) throw AppError.internalServerError('이미 존재하는 아이디입니다.');

  // 비밀번호 해싱
  const saltRounds = 12;
  const hashedPw = await bcrypt.hash(pw, saltRounds);

  const model = {
    id,
    name,
    pw: hashedPw,
    mobileNumber,
    address,
    addressDetail,
    zipcode,
    isServiceTermsAgreed,
    isPrivacyTermsAgreed,
    isMarketingTermsAgreed,
  };

  // 고객, 배송지, 고객-쿠폰 저장
  const customer = await CustomerService.createCustomerInfo(model);

  // JWT 토큰 발급
  const { ...payload } = customer;
  const accessToken = CustomerService.generateAccessToken(payload);
  const refreshToken = CustomerService.generateRefreshToken(payload);

  // cookie 설정
  res.cookie(REFRESH_COOKIE.name, refreshToken, REFRESH_COOKIE.option as CookieOptions);

  // 고객 RefreshToken 정보 업데이트
  await CustomerService.updateRefreshToken(customer.id, refreshToken);

  res.status(201).json(accessToken);
};
export const update = async (_: Request, res: Response) => {
  res.status(200).json('Hello World');
};
export const remove = async (_: Request, res: Response) => {
  res.status(204).json('Hello World');
};
