import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required').trim(),
  date: z.string().datetime('Invalid date format'),
  notes: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1, 'Category is required').trim().optional(),
  date: z.string().datetime('Invalid date format').optional(),
  notes: z.string().optional(),
});

export const recordQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordQuery = z.infer<typeof recordQuerySchema>;
