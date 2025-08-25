import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { ClientPayload } from '@/types/client-payload';

const SALT_ROUNDS = 12;
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
export function generateAccessToken(client: ClientPayload) {
  return jwt.sign(client, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
}

/** 리프레시 토큰 발급 */
export function generateRefreshToken(client: ClientPayload) {
  return jwt.sign(client, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/** 리프레시 토큰 검증 */
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
}

/** 임시 비밀번호 생성 */
export function generateTempPassword(): string {
  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,30}$/;

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?/';
  const allChars = upper + lower + numbers + symbols;

  function getRandomChar(chars: string) {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  while (true) {
    // 10~30 사이 랜덤 길이
    const length = Math.floor(Math.random() * (30 - 10 + 1)) + 10;

    // 각 조건 충족을 위해 최소 1개씩 넣기
    let password = '';
    password += getRandomChar(upper);
    password += getRandomChar(lower);
    password += getRandomChar(numbers);
    password += getRandomChar(symbols);

    // 나머지 자리는 랜덤하게 채움
    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars);
    }

    // 랜덤 섞기
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    // 정규식 검증
    if (regexp.test(password)) {
      return password;
    }
  }
}
