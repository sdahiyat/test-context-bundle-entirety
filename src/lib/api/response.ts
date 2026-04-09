import { NextResponse } from 'next/server';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data } satisfies ApiResponse<T>, { status });
}

export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201);
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details !== undefined ? { details } : {}) } } satisfies ApiResponse<never>,
    { status }
  );
}

export function badRequest(message: string, details?: unknown): NextResponse {
  return errorResponse('BAD_REQUEST', message, 400, details);
}

export function unauthorized(message?: string): NextResponse {
  return errorResponse('UNAUTHORIZED', message ?? 'Authentication required', 401);
}

export function forbidden(message?: string): NextResponse {
  return errorResponse('FORBIDDEN', message ?? 'Insufficient permissions', 403);
}

export function notFound(message?: string): NextResponse {
  return errorResponse('NOT_FOUND', message ?? 'Resource not found', 404);
}

export function conflict(message?: string): NextResponse {
  return errorResponse('CONFLICT', message ?? 'Resource already exists', 409);
}

export function unprocessable(message: string, details?: unknown): NextResponse {
  return errorResponse('UNPROCESSABLE_ENTITY', message, 422, details);
}

export function internalError(message?: string): NextResponse {
  return errorResponse('INTERNAL_SERVER_ERROR', message ?? 'An unexpected error occurred', 500);
}
