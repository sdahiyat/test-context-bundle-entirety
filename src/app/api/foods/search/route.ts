import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  requireAuth,
  validateQuery,
  successResponse,
  withErrorHandler,
  internalError,
} from '@/lib/api';

const foodSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query is too long'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const GET = withErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { supabase } = authResult;

  const queryResult = validateQuery(request.nextUrl.searchParams, foodSearchSchema);
  if (queryResult instanceof NextResponse) return queryResult;
  const { data: params } = queryResult;

  const { data: foods, error } = await supabase
    .from('foods')
    .select(
      'id, name, calories_per_serving, protein_g, carbs_g, fat_g, serving_size, serving_unit'
    )
    .ilike('name', `%${params.q}%`)
    .limit(params.limit)
    .order('name', { ascending: true });

  if (error) {
    console.error('[GET /api/foods/search]', error);
    return internalError('Failed to search foods');
  }

  return successResponse({ foods: foods ?? [] });
});
