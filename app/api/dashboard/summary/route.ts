import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FinancialRecord from '@/models/FinancialRecord';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
  incomeCount: number;
  expenseCount: number;
}

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build match stage
    const matchStage: any = { isDeleted: false };
    if (startDate && endDate) {
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Use aggregation pipeline for efficient calculation
    const result = await FinancialRecord.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          incomeCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, 1, 0],
            },
          },
          expenseCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, 1, 0],
            },
          },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    const summary: SummaryData = result[0] || {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      totalRecords: 0,
      incomeCount: 0,
      expenseCount: 0,
    };

    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    const response: ApiResponse<SummaryData> = {
      success: true,
      data: summary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_DASHBOARD');
