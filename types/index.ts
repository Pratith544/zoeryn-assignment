export type UserRole = 'viewer' | 'analyst' | 'admin';
export type UserStatus = 'active' | 'inactive';
export type RecordType = 'income' | 'expense';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinancialRecord {
  _id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend-facing types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface FinancialRecord {
  _id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  createdBy: string | User;
  createdAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategoryData {
  category: string;
  total: number;
  count: number;
  type: RecordType;
}

export interface TrendData {
  label: string;
  income: number;
  expenses: number;
  net: number;
}

export interface RecordFilters {
  page: number;
  limit: number;
  type?: RecordType | '';
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
