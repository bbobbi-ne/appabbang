export const CodeGroup = {
  BREAD_STATUS: 'bread_status',
  USER_ROLE: 'user_role',
  MATERIAL_TYPE: 'material_type',
  ORDER_STATUS: 'order_status',
  PURCHASE_STATUS: 'purchase_status',
  DELIVERY_TYPE: 'delivery_type',
} as const;

export type CodeGroupType = (typeof CodeGroup)[keyof typeof CodeGroup];

// 커스텀 에러 타입들
export enum ErrorType {
  // 400 Bad Request
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // 401 Unauthorized
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 403 Forbidden
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // 404 Not Found
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // 409 Conflict
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // 422 Unprocessable Entity
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',

  // 500 Internal Server Error
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export interface AppErrorOptions {
  statusCode: number;
  errorType: ErrorType;
  message: string;
  details?: any;
  cause?: Error;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.statusCode = options.statusCode;
    this.errorType = options.errorType;
    this.details = options.details;
    this.isOperational = true; // 예상 가능한 에러

    // Error.captureStackTrace가 있는 경우 스택 트레이스를 캡처
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // 원인 에러가 있으면 설정
    if (options.cause) {
      this.cause = options.cause;
    }
  }

  // 편의 메서드들
  static notFound(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 404,
      errorType: ErrorType.NOT_FOUND,
      message,
      details,
    });
  }

  static badRequest(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 400,
      errorType: ErrorType.VALIDATION_ERROR,
      message,
      details,
    });
  }

  static unauthorized(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 401,
      errorType: ErrorType.UNAUTHORIZED,
      message,
      details,
    });
  }

  static forbidden(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 403,
      errorType: ErrorType.FORBIDDEN,
      message,
      details,
    });
  }

  static conflict(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 409,
      errorType: ErrorType.CONFLICT,
      message,
      details,
    });
  }

  static unprocessableEntity(message: string, details?: any): AppError {
    return new AppError({
      statusCode: 422,
      errorType: ErrorType.UNPROCESSABLE_ENTITY,
      message,
      details,
    });
  }

  static internalServerError(message: string, details?: any, cause?: Error): AppError {
    return new AppError({
      statusCode: 500,
      errorType: ErrorType.INTERNAL_SERVER_ERROR,
      message,
      details,
      cause,
    });
  }
}
