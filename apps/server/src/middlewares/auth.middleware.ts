import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';
import { ClientPayload } from '@/types/client-payload';
import { getOneForCheck as getAdminUserOne } from '@/services/user.service';
import { getOneForCheck as getCustomerUserOne } from '@/services/customer.service';

/** JWT 토큰 검증 공통 함수 */
const verifyToken = async (req: Request): Promise<ClientPayload> => {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw AppError.unauthorized('Access token is required');
  }

  try {
    const user: ClientPayload = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          // decoded 타입이 string | object | undefined 이므로 ClientPayload로 단언
          if (!decoded || typeof decoded === 'string') {
            return reject(new Error('Invalid token payload'));
          }

          resolve(decoded as ClientPayload);
        }
      });
    });

    return user;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Token has expired');
    }
    throw AppError.forbidden('Invalid token');
  }
};

/** 인증 토큰 필수 - 모든 인증된 사용자 허용 */
export const requireAuth = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/** 인증 토큰 선택적 - 토큰이 있으면 검증, 없으면 통과 */
export const optionalAuth = async (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const user = await verifyToken(req);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/** 관리자 전용 - 관리자(user 타입)만 허용 */
export const requireAdmin = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);

    if (user.type !== 'user') {
      throw AppError.forbidden('Access denied: Admin access required');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/** 고객 전용 - 고객(customer 타입)만 허용 */
export const requireCustomer = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);

    if (user.type !== 'customer') {
      throw AppError.forbidden('Access denied: Customer access required');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/** 본인 검증 (고객이나 관리자) */
export const requireOwner = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);

    if (user.type === 'user') {
      // 관리자
      const adminUser = await getAdminUserOne(user.id);
      if (user.id !== adminUser.id) {
        throw AppError.forbidden('Access denied: 본인 소유 리소스가 아닙니다.');
      } else {
        req.user = user;
        return next();
      }
    } else if (user.type === 'customer') {
      // 고객
      const customerUser = await getCustomerUserOne(user.id);
      if (user.id !== customerUser.id) {
        throw AppError.forbidden('Access denied: 본인 소유 리소스가 아닙니다.');
      } else {
        req.user = user;
        return next();
      }
    } else {
      throw AppError.forbidden('Access denied: 관리자 또는 고객만 접근 가능합니다.');
    }
  } catch (error) {
    next(error);
  }
};

/** 본인 검증 ----> 관리자만 체크  */
export const requireAdminOwner = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);

    if (user.type !== 'user') {
      throw AppError.forbidden('Access denied: Customer access required');
    }

    // 관리자
    const adminUser = await getAdminUserOne(user.id);

    if (user.id !== adminUser.id) {
      throw AppError.forbidden('Access denied: 본인 소유 리소스가 아닙니다.');
    } else {
      req.user = user;
      return next();
    }
  } catch (error) {
    next(error);
  }
};

/** 본인 검증 ----> 고객만 체크  */
export const requireCustomerOwner = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);

    if (user.type !== 'customer') {
      throw AppError.forbidden('Access denied: Customer access required');
    }

    // 고객
    const customerUser = await getCustomerUserOne(user.id);
    if (customerUser.id && user.id !== customerUser.id) {
      throw AppError.forbidden('Access denied: 본인 소유 리소스가 아닙니다.');
    } else {
      req.user = user;
      return next();
    }
  } catch (error) {
    next(error);
  }
};
