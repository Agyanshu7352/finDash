/**
 * Utility functions for the Finance Dashboard.
 *
 * Pure functions that transform data for display and computation.
 * Keeping these separate from components promotes testability and reuse.
 */

import {
  Transaction,
  MonthlyData,
  BalanceTrendPoint,
  CategoryBreakdown,
  Category,
} from '@/types/finance';

/**
 * Format a number as USD currency.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string to a human-readable format.
 * e.g., "2024-01-15" → "Jan 15, 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Generate a unique ID for new transactions.
 * Uses timestamp + random suffix for collision resistance.
 * Trade-off: Not cryptographically secure, but sufficient for client-side state.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Compute monthly aggregates (income, expenses, savings) from transactions.
 * Groups by month-year and calculates running totals.
 */
export function computeMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const monthMap = new Map<string, { income: number; expenses: number }>();

  // Sort transactions by date to ensure chronological order
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sorted.forEach((t) => {
    const date = new Date(t.date + 'T00:00:00');
    const monthKey = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const existing = monthMap.get(monthKey) || { income: 0, expenses: 0 };
    if (t.type === 'income') {
      existing.income += t.amount;
    } else {
      existing.expenses += t.amount;
    }
    monthMap.set(monthKey, existing);
  });

  return Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
    savings: data.income - data.expenses,
  }));
}

/**
 * Compute running balance over time for the line chart.
 * Each transaction changes the balance by +income or -expense.
 */
export function computeBalanceTrend(
  transactions: Transaction[]
): BalanceTrendPoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let balance = 0;
  return sorted.map((t) => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    return {
      date: formatDate(t.date),
      balance,
    };
  });
}

/**
 * Color palette for category chart.
 * Uses distinct, accessible colors that work in both light and dark modes.
 */
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#f97316',
  Transportation: '#06b6d4',
  Shopping: '#8b5cf6',
  Entertainment: '#ec4899',
  'Bills & Utilities': '#ef4444',
  Healthcare: '#10b981',
  Education: '#3b82f6',
  Travel: '#f59e0b',
  Other: '#6b7280',
};

/**
 * Compute expense breakdown by category for the pie/bar chart.
 * Only includes expense transactions, not income.
 */
export function computeCategoryBreakdown(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const existing = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, existing + t.amount);
    });

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      fill: CATEGORY_COLORS[category] || '#6b7280',
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Find the highest spending category from transactions.
 * Returns null if no expense transactions exist.
 */
export function getHighestSpendingCategory(
  transactions: Transaction[]
): { category: Category; amount: number } | null {
  const breakdown = computeCategoryBreakdown(transactions);
  if (breakdown.length === 0) return null;
  return {
    category: breakdown[0].category as Category,
    amount: breakdown[0].amount,
  };
}

/**
 * Expense categories available for selection in forms.
 * Separated from income categories for better UX.
 */
export const EXPENSE_CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES: Category[] = [
  'Salary',
  'Freelance',
  'Investments',
  'Other',
];
