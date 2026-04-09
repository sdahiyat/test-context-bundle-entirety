import { NextResponse } from 'next/server';
import { successResponse, withErrorHandler } from '@/lib/api';

const GET = withErrorHandler(async (): Promise<NextResponse> => {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export { GET };
