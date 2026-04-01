/**
 * SummaryCard — Reusable metric card for the dashboard overview.
 *
 * Design: Uses glassmorphism-inspired styling with gradient accents.
 * The icon and color are configurable to distinguish between
 * balance, income, and expense metrics at a glance.
 */
'use client';

import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  accentColor: string;
  /** Optional CSS class for the gradient background of the icon container */
  gradientClass?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  accentColor,
  gradientClass = 'from-blue-500 to-blue-600',
}: SummaryCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white
        p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        dark:border-gray-700/50 dark:bg-gray-800/80 dark:backdrop-blur-sm"
    >
      {/* Subtle gradient accent on hover */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5
          bg-gradient-to-br ${gradientClass}`}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: accentColor }}
          >
            {value}
          </p>
          {trend && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {trend}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br
            ${gradientClass} text-white shadow-lg transition-transform duration-300
            group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
