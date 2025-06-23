import { Request, Response } from 'express';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/services/auth.service';
import type { User } from '@prisma/client';
import * as userService from '@/services/user.service';

/** 로그인 */
export async function login(req: Request, res: Response) {
  try {
    const { id, pw } = req.body;

    const user = await userService.getById(id);

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await comparePassword(pw, user.pw);

    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const { pw: _, ...rest } = user;

    const accessToken = generateAccessToken(rest);
    const refreshToken = generateRefreshToken(rest);

    // Refresh Token을 Secure HttpOnly 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, // HTTPS에서만 동작
      sameSite: 'strict', // CSRF 방지
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    await userService.updateRefreshToken(user.id, refreshToken);

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
}

/** 내 정보 조회 */
export async function me(_: Request, res: Response) {
  try {
    const { id } = res.locals.user;

    const user = await userService.getById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { pw: _, no, ...rest } = user;

    res.status(200).json({ ...rest });
  } catch (err) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
}

/** 리프레시 토큰 재발급 */
export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token missing' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const { iat, exp, ...user } = payload;

    const newAccessToken = generateAccessToken(user as Omit<User, 'pw'>);
    res.status(200).json({ accessToken: newAccessToken });
    return;
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
    return;
  }
}
