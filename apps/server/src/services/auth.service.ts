import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { CookieOptions } from 'express';

const SALT_ROUNDS = 10;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_ACCESS_EXPIRES_IN = '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_REFRESH_EXPIRES_IN = '7d';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // secure: true, // HTTPS에서만 동작
  sameSite: 'strict', // CSRF 방지
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
};

/** 비밀번호 해싱 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/** 비밀번호 비교 */
export async function comparePassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

/** 액세스 토큰 발급 */
export function generateAccessToken(
  user: Omit<User, 'pw' | 'refreshToken' | 'createdAt' | 'updatedAt'>,
) {
  return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
}

/** 리프레시 토큰 발급 */
export function generateRefreshToken(
  user: Omit<User, 'pw' | 'refreshToken' | 'createdAt' | 'updatedAt'>,
) {
  return jwt.sign(user, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/** 리프레시 토큰 검증 */
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
}
