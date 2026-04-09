import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  requireAuth,
  validateBody,
  validateQuery,
  successResponse,
  createdResponse,
  withErrorHandler,
  paginationSchema,
  buildPaginatedResponse,
  getPaginationRange,
  internalError,
} from '@/lib/api';

const createMealSchema = z.object({
  food_id: z.string().uuid('Invalid food ID'),
  portion_size: z.number().positive('Portion size must be positive'),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  logged_at: z.string().datetime().optional(),
});

const getMealsQuerySchema = paginationSchema.extend({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format')
    .optional(),
});

export const GET = withErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user, supabase } = authResult;

  const queryResult = validateQuery(request.nextUrl.searchParams, getMealsQuerySchema);
  if (queryResult instanceof NextResponse) return queryResult;
  const { data: params } = queryResult;

  const { from, to } = getPaginationRange({ page: params.page, limit: params.limit });

  let query = supabase
    .from('meals')
    .select(
      `
      *,
      foods (
        id,
        name,
        calories_per_serving,
        protein_g,
        carbs_g,
        fat_g,
        serving_size,
        serving_unit
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .range(from, to);

  if (params.date) {
    const startOfDay = `${params.date}T00:00:00.000Z`;
    const endOfDay = `${params.date}T23:59:59.999Z`;
    query = query.gte('logged_at', startOfDay).lte('logged_at', endOfDay);
  }

  const { data: meals, error, count } = await query;

  if (error) {
    console.error('[GET /api/meals]', error);
    return internalError('Failed to fetch meals');
  }

  return successResponse(
    buildPaginatedResponse(meals ?? [], count ?? 0, { page: params.page, limit: params.limit })
  );
});

export const POST = withErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user, supabase } = authResult;

  const bodyResult = await validateBody(request, createMealSchema);
  if (bodyResult instanceof NextResponse) return bodyResult;
  const { data: body } = bodyResult;

  const mealData = {
    user_id: user.id,
    food_id: body.food_id,
    portion_size: body.portion_size,
    meal_type: body.meal_type,
    logged_at: body.logged_at ?? new Date().toISOString(),
  };

  const { data: meal, error } = await supabase
    .from('meals')
    .insert(mealData)
    .select(
      `
      *,
      foods (
        id,
        name,
        calories_per_serving,
        protein_g,
        carbs_g,
        fat_g,
        serving_size,
        serving_unit
      )
    `
    )
    .single();

  if (error) {
    console.error('[POST /api/meals]', error);
    return internalError('Failed to create meal');
  }

  return createdResponse(meal);
});
