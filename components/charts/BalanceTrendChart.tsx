/**
 * BalanceTrendChart — Line chart showing running balance over time.
 *
 * Uses Recharts with custom styling for a polished look.
 * The gradient fill under the line provides visual weight to the trend.
 *
 * Design: ResponsiveContainer ensures the chart adapts to any parent width.
 * Custom tooltip provides detailed info on hover without cluttering the chart.
 */
'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinanceStore } from '@/store/useFinanceStore';
import { computeBalanceTrend, formatCurrency } from '@/lib/utils';

export default function BalanceTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions);
  const data = computeBalanceTrend(transactions);

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
        Balance Trend
      </h3>
      <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
        Running balance over time
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
            className="dark:[&_line]:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {payload[0].payload.date}
                  </p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(payload[0].value as number)}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#balanceGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: '#6366f1',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
