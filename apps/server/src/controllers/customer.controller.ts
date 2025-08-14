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

/**
 * 로그아웃
 */
export const logout = async (req: Request, res: Response) => {
  // 로그아웃할 고객 정보 조회
  const customer = await CustomerService.getTokenCustomer(req.body);

  if (customer) {
    // refreshToken 제거
    await CustomerService.invalidateRefreshToken(customer.id);
  }

  // Cookie의 refreshToken 제거
  res.clearCookie(REFRESH_COOKIE.name, {
    httpOnly: true,
    sameSite: 'strict', // 소문자 + 리터럴
    maxAge: 0,
  });

  res.sendStatus(204);
};
