import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/index';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    },
    { status: 500 }
  );
}
