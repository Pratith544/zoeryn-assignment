import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FinancialRecord from '@/models/FinancialRecord';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload } from '@/types/index';
import { handleApiError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  type: 'income' | 'expense';
}

interface CategoriesData {
  categories: CategoryBreakdown[];
}

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    // Build match stage
    const matchStage: any = { isDeleted: false };
    if (startDate && endDate) {
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (type && ['income', 'expense'].includes(type)) {
      matchStage.type = type;
    }

    // Use aggregation pipeline
    const result = await FinancialRecord.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const response: ApiResponse<CategoriesData> = {
      success: true,
      data: {
        categories: result as CategoryBreakdown[],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_DASHBOARD');
