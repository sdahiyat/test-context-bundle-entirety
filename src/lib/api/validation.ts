import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z, ZodSchema, ZodError } from 'zod';
import { badRequest, unprocessable } from './response';

export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.') || 'root',
      message: err.message,
    }));
    return unprocessable('Validation failed', errors);
  }

  return { data: result.data };
}

export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { data: T } | NextResponse {
  const raw = Object.fromEntries(searchParams);
  const result = schema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.') || 'root',
      message: err.message,
    }));
    return unprocessable('Validation failed', errors);
  }

  return { data: result.data };
}

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format');
