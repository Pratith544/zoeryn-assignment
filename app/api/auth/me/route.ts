import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { ApiResponse, IUser } from '@/types/index'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { ApiError, handleApiError } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or header
    const token = getTokenFromRequest(req)

    if (!token) {
      throw new ApiError(401, 'Not authenticated')
    }

    // Verify token
    const payload = verifyToken(token)

    if (!payload || !payload.userId) {
      throw new ApiError(401, 'Invalid token')
    }

    await connectDB()

    // Find user
    const user = await User.findById(payload.userId)

    if (!user) {
      throw new ApiError(401, 'User not found')
    }

    if (user.status !== 'active') {
      throw new ApiError(401, 'User account is inactive')
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } as IUser,
        message: 'User retrieved',
      } as ApiResponse<IUser>,
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
