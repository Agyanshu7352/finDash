/**
 * EmptyState — Displayed when no transactions exist or match filters.
 *
 * Provides visual context and a clear call-to-action for admins,
 * while showing a simpler message for viewers who can't add data.
 */
'use client';

import { useFinanceStore } from '@/store/useFinanceStore';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No transactions found',
  description = 'Try adjusting your filters or add a new transaction.',
  showAction = false,
  onAction,
}: EmptyStateProps) {
  const role = useFinanceStore((s) => s.role);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Illustration */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <svg
          className="h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {showAction && role === 'admin' && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5
            text-sm font-semibold text-white shadow-lg transition-all duration-200
            hover:shadow-xl hover:-translate-y-0.5"
        >
          + Add Transaction
        </button>
      )}
    </div>
  );
}
