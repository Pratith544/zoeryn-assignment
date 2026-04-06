import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FinancialRecord from '@/models/FinancialRecord';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload, IFinancialRecord } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';
import { updateRecordSchema } from '@/lib/validations/records';
import { Types } from 'mongoose';

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  try {
    const { id } = context.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid record ID');
    }

    await connectDB();

    const record = await FinancialRecord.findOne({ _id: id, isDeleted: false }).lean();

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    const response: ApiResponse<IFinancialRecord> = {
      success: true,
      data: record as IFinancialRecord,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handlePATCH(req: NextRequest, context: any, user: JwtPayload) {
  try {
    const { id } = context.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid record ID');
    }

    const body = await req.json();

    const validation = updateRecordSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      throw new ApiError(400, 'Validation failed', errors);
    }

    const updateData: any = validation.data;

    // Convert date if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    await connectDB();

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    const response: ApiResponse<IFinancialRecord> = {
      success: true,
      data: record as IFinancialRecord,
      message: 'Record updated successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleDELETE(req: NextRequest, context: any, user: JwtPayload) {
  try {
    const { id } = context.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid record ID');
    }

    await connectDB();

    const record = await FinancialRecord.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!record) {
      throw new ApiError(404, 'Record not found');
    }

    const response: ApiResponse = {
      success: true,
      message: 'Record deleted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_RECORDS');
export const PATCH = withAuth(handlePATCH, 'UPDATE_RECORD');
export const DELETE = withAuth(handleDELETE, 'DELETE_RECORD');
