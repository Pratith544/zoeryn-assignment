import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FinancialRecord from '@/models/FinancialRecord';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload, PaginatedResponse, IFinancialRecord } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';
import { createRecordSchema } from '@/lib/validations/records';

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || undefined
    const category = searchParams.get('category') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const filter: any = { isDeleted: false };
    if (type) filter.type = type;
    if (category) filter.category = new RegExp(category, 'i'); // Case-insensitive
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get total count
    const total = await FinancialRecord.countDocuments(filter);

    // Get paginated records
    const sortOrder_num = sortOrder === 'asc' ? 1 : -1;
    const records = await FinancialRecord.find(filter)
      .sort({ [sortBy]: sortOrder_num })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const response: ApiResponse<PaginatedResponse<IFinancialRecord>> = {
      success: true,
      data: {
        items: records as IFinancialRecord[],
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

    const validation = createRecordSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      throw new ApiError(400, 'Validation failed', errors);
    }

    const { amount, type, category, date, notes } = validation.data;

    await connectDB();

    const record = new FinancialRecord({
      amount,
      type,
      category,
      date: new Date(date),
      notes,
      createdBy: user.userId,
      isDeleted: false,
    });

    await record.save();

    const response: ApiResponse<IFinancialRecord> = {
      success: true,
      data: record.toObject() as IFinancialRecord,
      message: 'Record created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_RECORDS');
export const POST = withAuth(handlePOST, 'CREATE_RECORD');
