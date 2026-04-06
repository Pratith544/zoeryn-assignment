import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations/auth';
import { ApiResponse, IUser } from '@/types/index';
import { ApiError, handleApiError } from '@/lib/errors';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      throw new ApiError(400, 'Validation failed', errors);
    }

    const { name, email, password, role } = validation.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role,
      status: 'active',
    });

    await user.save();

    // Create JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json(
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
        message: 'User registered successfully',
      } as ApiResponse<IUser>,
      { status: 201 }
    );

    // Set httpOnly cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
