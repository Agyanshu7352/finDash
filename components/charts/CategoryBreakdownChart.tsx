/**
 * CategoryBreakdownChart — Bar chart showing expense distribution by category.
 *
 * Design decision: Using horizontal bar chart instead of pie chart for better
 * readability with category names. Pie charts are notoriously hard to read
 * when there are many small slices; bars provide direct visual comparison.
 *
 * Each bar uses a category-specific color from our defined palette.
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
  Cell,
} from 'recharts';
import { useFinanceStore } from '@/store/useFinanceStore';
import { computeCategoryBreakdown, formatCurrency } from '@/lib/utils';

export default function CategoryBreakdownChart() {
  const transactions = useFinanceStore((s) => s.transactions);
  const data = computeCategoryBreakdown(transactions);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/50 dark:bg-gray-800/80">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        Expense Breakdown
      </h3>
      <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
        Spending by category
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            horizontal={false}
            className="dark:[&_line]:stroke-gray-700"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category}
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: item.fill }}
                  >
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
