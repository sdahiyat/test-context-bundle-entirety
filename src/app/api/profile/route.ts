import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  requireAuth,
  validateBody,
  successResponse,
  notFound,
  withErrorHandler,
  internalError,
} from '@/lib/api';

const updateProfileSchema = z.object({
  display_name: z.string().min(1, 'Display name cannot be empty').max(100).optional(),
  weight_kg: z.number().positive('Weight must be positive').optional(),
  height_cm: z.number().positive('Height must be positive').optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format')
    .optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  activity_level: z
    .enum([
      'sedentary',
      'lightly_active',
      'moderately_active',
      'very_active',
      'extra_active',
    ])
    .optional(),
});

export const GET = withErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user, supabase } = authResult;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return notFound('Profile not found');
  }

  return successResponse(profile);
});

export const PUT = withErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user, supabase } = authResult;

  const bodyResult = await validateBody(request, updateProfileSchema);
  if (bodyResult instanceof NextResponse) return bodyResult;
  const { data: body } = bodyResult;

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) {
    console.error('[PUT /api/profile]', error);
    return internalError('Failed to update profile');
  }

  if (!updatedProfile) {
    return notFound('Profile not found');
  }

  return successResponse(updatedProfile);
});
