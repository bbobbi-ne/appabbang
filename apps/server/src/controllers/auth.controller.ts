import { Request, Response } from 'express';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  verifyRefreshToken,
} from '@/services/auth.service';
import type { User } from '@prisma/client';
import * as userService from '@/services/user.service';
import { AppError } from '@/types';

/** 로그인 */
export async function login(req: Request, res: Response) {
  const { id, pw } = req.body;

  const user = await userService.getById(id);

  if (!user) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const valid = await comparePassword(pw, user.pw);

  if (!valid) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const { pw: userPw, ...rest } = user;

  const accessToken = generateAccessToken(rest);
  const refreshToken = generateRefreshToken(rest);

  // Refresh Token을 Secure HttpOnly 쿠키로 설정
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  await userService.updateRefreshToken(user.id, refreshToken);

  res.status(200).json({ accessToken });
}

/** 내 정보 조회 */
export async function me(_: Request, res: Response) {
  const { id } = res.locals.user;

  const user = await userService.getById(id);

  if (!user) {
    throw AppError.notFound('User not found');
  }

  const { pw: userPw, no, ...rest } = user;

  res.status(200).json({ ...rest });
}

/** 리프레시 토큰 재발급 */
export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw AppError.unauthorized('Refresh token missing');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const { iat, exp, ...user } = payload;

    const newAccessToken = generateAccessToken(user as Omit<User, 'pw'>);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    throw AppError.forbidden('Invalid refresh token');
  }
}
