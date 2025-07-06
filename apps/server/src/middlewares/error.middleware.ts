import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '@/types';

// 에러 핸들링 미들웨어
export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // AppError인 경우
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.errorType,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  // Prisma 에러 처리
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;

    // P2002: Unique constraint violation
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          type: 'CONFLICT',
          message: '중복된 데이터가 존재합니다.',
          details: prismaError.meta?.target,
        },
      });
      return;
    }

    // P2025: Record not found
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: '요청한 데이터를 찾을 수 없습니다.',
        },
      });
      return;
    }

    // P2003: Foreign key constraint violation
    if (prismaError.code === 'P2003') {
      res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: '참조하는 데이터가 존재하지 않습니다.',
          details: prismaError.meta?.field_name,
        },
      });
      return;
    }
  }

  // JWT 에러 처리
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        type: 'UNAUTHORIZED',
        message: '유효하지 않은 토큰입니다.',
      },
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        type: 'TOKEN_EXPIRED',
        message: '토큰이 만료되었습니다.',
      },
    });
    return;
  }

  // Validation 에러 처리 (express-validator)
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: '입력 데이터가 유효하지 않습니다.',
        details: error.message,
      },
    });
    return;
  }

  // 기본 500 에러
  console.error('Unhandled Error:', error);

  res.status(500).json({
    success: false,
    error: {
      type: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack,
      }),
    },
  });
};

// 404 에러 핸들러
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND',
      message: `경로 ${req.originalUrl}을(를) 찾을 수 없습니다.`,
    },
  });
};

// 비동기 에러 래퍼 (컨트롤러에서 사용)
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
