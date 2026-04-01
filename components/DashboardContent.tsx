/**
 * DashboardContent — Client component for the main dashboard page.
 *
 * Renders summary cards, charts, and recent transactions.
 * Uses Zustand selectors to derive computed values (totals, balance)
 * without storing them, following "single source of truth" pattern.
 */
'use client';

import {
  useFinanceStore,
  getTotalBalance,
  getTotalIncome,
  getTotalExpenses,
} from '@/store/useFinanceStore';
import SummaryCard from '@/components/ui/SummaryCard';
import BalanceTrendChart from '@/components/charts/BalanceTrendChart';
import CategoryBreakdownChart from '@/components/charts/CategoryBreakdownChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardContent() {
  const totalBalance = useFinanceStore(getTotalBalance);
  const totalIncome = useFinanceStore(getTotalIncome);
  const totalExpenses = useFinanceStore(getTotalExpenses);
  const transactions = useFinanceStore((s) => s.transactions);

  // Get 5 most recent transactions for the preview
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your financial overview at a glance
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          accentColor="#6366f1"
          gradientClass="from-indigo-500 to-indigo-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={`${transactions.length} total transactions`}
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          accentColor="#10b981"
          gradientClass="from-emerald-500 to-emerald-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
          trend="All time earnings"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          accentColor="#f43f5e"
          gradientClass="from-rose-500 to-rose-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
          trend="All time spending"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BalanceTrendChart />
        <CategoryBreakdownChart />
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/50 dark:bg-gray-800/80">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <Link
            href="/transactions"
            className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-xl p-3 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                {/* Category icon circle */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm
                    ${
                      t.type === 'income'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                  {t.type === 'income' ? '↗' : '↙'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {t.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(t.date)} · {t.category}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
