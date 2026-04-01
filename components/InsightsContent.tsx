/**
 * InsightsContent — Client component for the insights page.
 *
 * Computes and displays derived financial insights:
 * - Highest spending category
 * - Monthly comparison chart
 * - Total savings
 * - Savings rate percentage
 *
 * All values are computed on-the-fly from the transaction state,
 * following the "derive, don't duplicate" principle.
 */
'use client';

import {
  useFinanceStore,
  getTotalIncome,
  getTotalExpenses,
} from '@/store/useFinanceStore';
import {
  getHighestSpendingCategory,
  computeMonthlyData,
  formatCurrency,
} from '@/lib/utils';
import MonthlyComparisonChart from '@/components/charts/MonthlyComparisonChart';

export default function InsightsContent() {
  const transactions = useFinanceStore((s) => s.transactions);
  const totalIncome = useFinanceStore(getTotalIncome);
  const totalExpenses = useFinanceStore(getTotalExpenses);

  const highestCategory = getHighestSpendingCategory(transactions);
  const monthlyData = computeMonthlyData(transactions);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  // Find best and worst months for savings
  const bestMonth = monthlyData.length > 0
    ? monthlyData.reduce((best, m) => (m.savings > best.savings ? m : best))
    : null;
  const worstMonth = monthlyData.length > 0
    ? monthlyData.reduce((worst, m) => (m.savings < worst.savings ? m : worst))
    : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Financial Insights
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Detailed analysis of your financial patterns
        </p>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Savings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/80">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Savings
          </p>
          <p className={`mt-1 text-2xl font-bold ${totalSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {formatCurrency(totalSavings)}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Income minus expenses
          </p>
        </div>

        {/* Savings Rate */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/80">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Savings Rate
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Percentage of income saved
          </p>
        </div>

        {/* Highest Spending Category */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/80">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Top Spending
          </p>
          <p className="mt-1 text-lg font-bold text-orange-600 dark:text-orange-400">
            {highestCategory?.category || 'N/A'}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {highestCategory ? formatCurrency(highestCategory.amount) : 'No data'}
          </p>
        </div>

        {/* Transaction Count */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/80">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Transactions
          </p>
          <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {transactions.length}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Across {monthlyData.length} months
          </p>
        </div>
      </div>

      {/* Monthly comparison chart */}
      <MonthlyComparisonChart />

      {/* Monthly breakdown table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/50 dark:bg-gray-800/80">
        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          Monthly Breakdown
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Detailed savings by month
        </p>

        {monthlyData.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Income</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Expenses</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Savings</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {monthlyData.map((m) => (
                  <tr key={m.month} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {m.month}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(m.income)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-500 dark:text-red-400">
                      {formatCurrency(m.expenses)}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 text-right text-sm font-bold ${
                      m.savings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                    }`}>
                      {formatCurrency(m.savings)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        m.savings >= 0
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {m.savings >= 0 ? '✓ Surplus' : '⚠ Deficit'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Best/Worst month highlights */}
      {bestMonth && worstMonth && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-gray-800/80">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Best Month
              </p>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {bestMonth.month}
            </p>
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
              Saved {formatCurrency(bestMonth.savings)}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-800/50 dark:from-amber-900/20 dark:to-gray-800/80">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Highest Spend Month
              </p>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {worstMonth.month}
            </p>
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              Saved {formatCurrency(worstMonth.savings)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
