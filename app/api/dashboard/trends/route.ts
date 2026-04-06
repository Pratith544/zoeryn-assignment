import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FinancialRecord from '@/models/FinancialRecord';
import { withAuth } from '@/lib/middleware';
import { ApiResponse, JwtPayload } from '@/types/index';
import { handleApiError, ApiError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

interface TrendData {
  label: string;
  income: number;
  expenses: number;
  net: number;
}

interface TrendsData {
  period: 'monthly' | 'weekly';
  data: TrendData[];
}

async function handleGET(req: NextRequest, context: any, user: JwtPayload) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'monthly') as 'monthly' | 'weekly';
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10);

    if (!['monthly', 'weekly'].includes(period)) {
      throw new ApiError(400, 'Period must be "monthly" or "weekly"');
    }

    if (isNaN(year)) {
      throw new ApiError(400, 'Invalid year');
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    let groupStage: any;
    let sortStage: any;
    let projectStage: any;

    if (period === 'monthly') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      };

      sortStage = { $sort: { '_id.year': 1, '_id.month': 1 } };

      projectStage = {
        $project: {
          _id: 0,
          label: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  { $subtract: ['$_id.month', 1] },
                ],
              },
              ' ',
              { $toString: '$_id.year' },
            ],
          },
          income: 1,
          expenses: 1,
        },
      };
    } else {
      // weekly
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      };

      sortStage = { $sort: { '_id.year': 1, '_id.week': 1 } };

      projectStage = {
        $project: {
          _id: 0,
          label: {
            $concat: ['Week ', { $toString: '$_id.week' }, ' - ', { $toString: '$_id.year' }],
          },
          income: 1,
          expenses: 1,
        },
      };
    }

    const result = await FinancialRecord.aggregate([
      {
        $match: {
          isDeleted: false,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      groupStage,
      sortStage,
      projectStage,
    ]);

    const data = result.map((item: any) => ({
      label: item.label,
      income: item.income,
      expenses: item.expenses,
      net: item.income - item.expenses,
    }));

    const response: ApiResponse<TrendsData> = {
      success: true,
      data: {
        period,
        data,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handleGET, 'VIEW_TRENDS');
