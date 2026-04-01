/**
 * TransactionFilters — Search, filter, and sort controls for transactions.
 *
 * Design: Uses a horizontal filter bar pattern (similar to GitHub, Stripe)
 * instead of separate dropdowns. This reduces cognitive load and makes
 * the current filter state immediately visible.
 *
 * The search input has a debounce-like feel since Zustand updates are instant.
 */
'use client';

import { useFinanceStore } from '@/store/useFinanceStore';

export default function TransactionFilters() {
  const filters = useFinanceStore((s) => s.filters);
  const setSearch = useFinanceStore((s) => s.setSearch);
  const setTypeFilter = useFinanceStore((s) => s.setTypeFilter);
  const setSortBy = useFinanceStore((s) => s.setSortBy);
  const toggleSortOrder = useFinanceStore((s) => s.toggleSortOrder);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative flex-1 sm:max-w-xs">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search category, description, amount..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4
            text-sm text-gray-900 placeholder-gray-400 outline-none transition-all
            duration-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
            dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
            dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Type filter */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-0.5 dark:border-gray-600 dark:bg-gray-800">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200
                ${
                  filters.type === type
                    ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
