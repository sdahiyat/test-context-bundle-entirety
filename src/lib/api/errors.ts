import { NextResponse } from 'next/server';
import { errorResponse, internalError } from './response';

export class AppError extends Error {
  constructor(
    public code: string,
    public override message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 422, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, 401);
    this.name = 'UnauthorizedError';
  }
}

export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
): (...args: T) => Promise<NextResponse> {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof AppError) {
        return errorResponse(err.code, err.message, err.statusCode, err.details);
      }
      if (err instanceof Error) {
        console.error('[API Error]', err.message, err.stack);
      } else {
        console.error('[API Error] Unknown error', err);
      }
      return internalError();
    }
  };
}
