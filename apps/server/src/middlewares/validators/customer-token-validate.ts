// 인증 미들웨어
import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '@/types';

/**
 * 로그인 토큰 유효성 검증
 */
export const authenticateToken: RequestHandler = (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(AppError.unauthorized('Authorization 헤더가 없습니다.'));

  try {
    const token = authHeader.split(' ')[1] as string;
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    req.user = decoded;

    next();
  } catch {
    return next(AppError.forbidden('토큰이 유효하지 않습니다.'));
  }
};
