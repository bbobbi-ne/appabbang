import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw AppError.unauthorized('Access token is required');
  }

  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    res.locals.user = user;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Token has expired');
    }
    throw AppError.forbidden('Invalid token');
  }
}
