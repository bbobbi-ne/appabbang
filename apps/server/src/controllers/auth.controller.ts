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
    // 관리자인 경우
    await userService.updateRefreshToken(client.id, refreshToken);
    return res.status(200).json({ accessToken });
  } else if (type === ClientType.CUSTOMER) {
    // 고객인 경우
    await userService.updateCustomerRefreshToken(client.id, refreshToken);

    // 결과값 전송
    const result = {
      data: client,
      accessToken,
    };

    return res.status(200).json(result);
  }
};

/** 내 정보 조회 */
export const me = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
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

/** 로그아웃 (어드민, 고객) */
export const logout = async (req: Request, res: Response) => {
  const user = req.user;

  // refreshToken 제거
  if (user.type === ClientType.USER) {
    await userService.invalidateRefreshToken(user.no, user.id);
  } else if (user.type === ClientType.CUSTOMER) {
    await customerService.invalidateRefreshToken(user.no, user.id);
  } else {
    throw AppError.badRequest('로그아웃 처리 중 오류가 발생했습니다.');
  }

  // Cookie의 refreshToken 제거
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'strict', // 소문자 + 리터럴
    maxAge: 0,
  });

  res.sendStatus(204);
};
