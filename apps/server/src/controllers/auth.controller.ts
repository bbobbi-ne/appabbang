import { Request, Response } from 'express';
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

  const client = await getClientForLogin(id, type);
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

// 클라이언트 조회
async function getClientForLogin(id: string, type: ClientType) {
  if (type === ClientType.USER) {
    const user = await userService.getByIdForLogin(id);
    if (!user) throw AppError.unauthorized('아이디 또는 비밀번호를 확인해주세요.');
    return {
      ...user,
      type,
      pw: user.pw,
      userRole: user.userRole as 'admin' | 'subadmin',
    };
  }

  if (type === ClientType.CUSTOMER) {
    const customer = await customerService.getByIdForLogin(id);
    if (!customer?.pw || !customer.id) {
      throw AppError.unauthorized('아이디 또는 비밀번호를 확인해주세요.');
    }
    return {
      no: customer.no,
      name: customer.name,
      id: customer.id,
      pw: customer.pw,
      type,
    };
  }

  throw AppError.badRequest('잘못된 로그인 유형입니다.');
}

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

  console.log(totalAmount);

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
