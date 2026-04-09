import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  requireAuth,
  validateBody,
  successResponse,
  noContentResponse,
  notFound,
  forbidden,
  withErrorHandler,
  internalError,
} from '@/lib/api';

const updateMealSchema = z
  .object({
    portion_size: z.number().positive('Portion size must be positive').optional(),
    meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
    logged_at: z.string().datetime().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(
  async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user, supabase } = authResult;

    const { id } = await context.params;

    const { data: meal, error } = await supabase
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
      `
      )
      .eq('id', id)
      .single();

    if (error || !meal) {
      return notFound('Meal not found');
    }

    if (meal.user_id !== user.id) {
      return forbidden('You do not own this meal');
    }

    return successResponse(meal);
  }
);

export const PUT = withErrorHandler(
  async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user, supabase } = authResult;

    const { id } = await context.params;

    const { data: existingMeal, error: fetchError } = await supabase
      .from('meals')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingMeal) {
      return notFound('Meal not found');
    }

    if (existingMeal.user_id !== user.id) {
      return forbidden('You do not own this meal');
    }

    const bodyResult = await validateBody(request, updateMealSchema);
    if (bodyResult instanceof NextResponse) return bodyResult;
    const { data: body } = bodyResult;

    const { data: updatedMeal, error: updateError } = await supabase
      .from('meals')
      .update(body)
      .eq('id', id)
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

    if (updateError) {
      console.error('[PUT /api/meals/[id]]', updateError);
      return internalError('Failed to update meal');
    }

    return successResponse(updatedMeal);
  }
);

export const DELETE = withErrorHandler(
  async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user, supabase } = authResult;

    const { id } = await context.params;

    const { data: existingMeal, error: fetchError } = await supabase
      .from('meals')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingMeal) {
      return notFound('Meal not found');
    }

    if (existingMeal.user_id !== user.id) {
      return forbidden('You do not own this meal');
    }

    const { error: deleteError } = await supabase.from('meals').delete().eq('id', id);

    if (deleteError) {
      console.error('[DELETE /api/meals/[id]]', deleteError);
      return internalError('Failed to delete meal');
    }

    return noContentResponse();
  }
);
