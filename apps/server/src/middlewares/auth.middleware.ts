import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';
import { ClientPayload } from '@/types/client-payload';

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

/** 고객 본인 검증 - 고객은 본인만, 관리자는 모든 접근 */
export const requireCustomerOwner = (resourceOwnerIdGetter: (req: Request) => Promise<any>) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const user = await verifyToken(req);
      const resourceOwnerId = await Promise.resolve(resourceOwnerIdGetter(req));

      // 관리자는 모든 리소스에 접근 가능
      if (user.type === 'user') {
        req.user = user;
        return next();
      }

      // 고객인 경우에만 본인 검증
      if (user.type === 'customer') {
        if (user.id !== resourceOwnerId.toString()) {
          throw AppError.forbidden('Access denied: You can only access your own resources');
        }
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
