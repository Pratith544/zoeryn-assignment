import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/index';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully',
    } as ApiResponse,
    { status: 200 }
  );

  clearAuthCookie(response);

  return response;
}
