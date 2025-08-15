import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  verifyRefreshToken,
} from '@/services/auth.service';
import * as userService from '@/services/user.service';
import * as customerService from '@/services/customer.service';
import { AppError } from '@/types';
import { ClientPayload, ClientType } from '@/types/client-payload';

/** 로그인 */
export const login = async (req: Request, res: Response) => {
  const { id, pw, type } = req.body;

  const client = await userService.getClientForLogin(id, type);
  const isValid = await comparePassword(pw, client.pw);

  if (!isValid) {
    throw AppError.unauthorized('아이디 또는 비밀번호를 확인해주세요.');
  }

  const { pw: _, ...payload } = client;

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  if (type === ClientType.USER) {
    await userService.updateRefreshToken(client.id, refreshToken);
  } else if (type === ClientType.CUSTOMER) {
    // await customerService.updateRefreshToken(client.id, refreshToken);
  }

  res.status(200).json({ accessToken });
};

/** 내 정보 조회 */
export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('User not found');
  }

  res.status(200).json(req.user);
};

/**
 * 내 정보 상세조회
 */
export const getCustomerInfo = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('고객정보를 조회할 수 없습니다.');

  // 고객 상세정보 조회 + 고객 보유 쿠폰 조회
  const { customer, coupon } = await userService.getCustomerInfo(req.user.no);
  const totalAmount = await userService.getOrderAccumulatedAmount(req.user.no);
  res.status(200).json({ customer, coupon, totalAmount });
};

/** 리프레시 토큰으로 엑세스 토큰 재발급 */
export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw AppError.unauthorized('Refresh token missing');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const { iat, exp, ...client } = payload;

    const newAccessToken = generateAccessToken(client as ClientPayload);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    throw AppError.forbidden('Invalid refresh token');
  }
};

/**
 * 고객정보 수정
 */
export const update = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  // 고객 정보 조회
  const findCustomer = await userService.getCustomerInfo(req.user.no);
  if (!findCustomer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  const customer = await userService.update(req.body);
  res.status(200).json({ customer });
};

/**
 * 고객정보 수정 : 비밀번호 변경
 */
export const updatePw = async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized('토큰에 저장된 고객정보를 확인할 수 없습니다.');

  const { no } = req.user;
  const { pw, pwModify } = req.body;

  // 고객 정보 조회
  const customer = await userService.findCustomerPw(no);
  if (!customer)
    throw AppError.internalServerError(
      '고객정보 조회 과정에서 오류가 발생했습니다. 관리자 확인이 필요합니다.',
    );

  // 비밀번호 비교
  const isValid = await comparePassword(pw, customer.pw);
  if (!isValid) throw AppError.internalServerError('현재 비밀번호가 올바르지 않습니다.');

  // 비밀번호 해싱
  const saltRounds = 12;
  const hashedPw = await bcrypt.hash(pwModify, saltRounds);

  // 비밀번호 변경
  await userService.updatePw(no, hashedPw);
  res.status(200).json();
};
