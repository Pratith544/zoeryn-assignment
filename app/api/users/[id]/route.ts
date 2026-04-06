import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload, IUser } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';
import { Types } from 'mongoose';

async function handleGET(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }, user: JwtPayload) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log('User ID received (GET):', id);
    console.log('Is valid ObjectId:', Types.ObjectId.isValid(id));

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    await connectDB();

    const foundUser = await User.findById(id).select('-passwordHash').lean();

    if (!foundUser) {
      throw new ApiError(404, 'User not found');
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: foundUser as IUser,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handlePATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }, user: JwtPayload) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log('User ID received (PATCH):', id);
    console.log('Is valid ObjectId:', Types.ObjectId.isValid(id));

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const body = await req.json();
    const { name, role, status } = body;

    // Only allow updating these fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) {
      if (!['viewer', 'analyst', 'admin'].includes(role)) {
        throw new ApiError(400, 'Invalid role');
      }
      updateData.role = role;
    }
    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-passwordHash')
      .lean();

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: updatedUser as IUser,
      message: 'User updated successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleDELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }, user: JwtPayload) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log('User ID received (DELETE):', id);
    console.log('Is valid ObjectId:', Types.ObjectId.isValid(id));

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    await connectDB();

    const foundUser = await User.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    ).select('-passwordHash');

    if (!foundUser) {
      throw new ApiError(404, 'User not found');
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_ALL_USERS');
export const PATCH = withAuth(handlePATCH, 'UPDATE_USER');
export const DELETE = withAuth(handleDELETE, 'DELETE_USER');
