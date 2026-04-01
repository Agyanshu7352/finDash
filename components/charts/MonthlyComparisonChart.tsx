/**
 * MonthlyComparisonChart — Grouped bar chart comparing income vs expenses by month.
 *
 * Used in the Insights page to visualize the monthly comparison data.
 * Shows income and expenses side by side for easy comparison.
 */
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useFinanceStore } from '@/store/useFinanceStore';
import { computeMonthlyData, formatCurrency } from '@/lib/utils';

export default function MonthlyComparisonChart() {
  const transactions = useFinanceStore((s) => s.transactions);
  const data = computeMonthlyData(transactions);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No data to display
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/50 dark:bg-gray-800/80">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        Monthly Comparison
      </h3>
      <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
        Income vs. expenses by month
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
            className="dark:[&_line]:stroke-gray-700"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                  <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {label}
                  </p>
                  {payload.map((p) => (
                    <p
                      key={p.name}
                      className="text-sm"
                      style={{ color: p.color }}
                    >
                      <span className="font-semibold">{p.name}:</span>{' '}
                      {formatCurrency(p.value as number)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          <Bar
            name="Income"
            dataKey="income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
          <Bar
            name="Expenses"
            dataKey="expenses"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
