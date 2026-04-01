/**
 * Core types for the Finance Dashboard.
 *
 * Design decision: We use discriminated unions for TransactionType
 * rather than a boolean `isIncome` flag. This makes the type system
 * more expressive and allows exhaustive pattern matching.
 */

export type TransactionType = 'income' | 'expense';

/**
 * Role-based access control type.
 * - Admin: full CRUD access to transactions
 * - Viewer: read-only access
 *
 * Trade-off: Frontend-only role enforcement. In a real app, this would
 * be validated server-side. Here we use it purely for UI gating.
 */
export type UserRole = 'admin' | 'viewer';

/**
 * Expense categories are predefined to ensure consistent charting
 * and avoid typo-related data fragmentation.
 */
export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

/**
 * Filter state for the transactions table.
 * Keeping filters in the store enables persistence and
 * sharing between components without prop drilling.
 */
export interface TransactionFilters {
  search: string;
  type: TransactionType | 'all';
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}

/**
 * Computed insights derived from transaction data.
 * These are calculated on-the-fly rather than stored,
 * following the "derive, don't duplicate" principle.
 */
export interface Insights {
  highestSpendingCategory: { category: Category; amount: number } | null;
  monthlyComparison: MonthlyData[];
  totalSavings: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface MonthlyData {
  month: string; // e.g., "Jan 2024"
  income: number;
  expenses: number;
  savings: number;
}

/** Chart data point for the balance trend line chart */
export interface BalanceTrendPoint {
  date: string;
  balance: number;
}

/** Chart data point for the category pie chart */
export interface CategoryBreakdown {
  category: string;
  amount: number;
  fill: string;
}

/** Toast notification type for user feedback */
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
