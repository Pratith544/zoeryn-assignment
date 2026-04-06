import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload, PaginatedResponse, IUser } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  console.log('GET /api/users called');
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role') || undefined
    const status = searchParams.get('status') || undefined

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (role) filter.role = role;

    // Get total count
    const total = await User.countDocuments(filter);

    // Get paginated users
    const users = await User.find(filter)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const response: ApiResponse<PaginatedResponse<IUser>> = {
      success: true,
      data: {
        items: users as IUser[],
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handlePOST(req: NextRequest, context: any, user: JwtPayload) {
  try {
    const body = await req.json();

    // Validate input with same schema as register
    const { name, email, password, role = 'viewer' } = body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }

    if (typeof password !== 'string' || password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters');
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role,
      status: 'active',
    });

    await newUser.save();

    const response: ApiResponse<IUser> = {
      success: true,
      data: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      message: 'User created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_ALL_USERS');
export const POST = withAuth(handlePOST, 'CREATE_USER');
