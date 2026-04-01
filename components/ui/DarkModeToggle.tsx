/**
 * DarkModeToggle — Animated toggle for light/dark theme.
 *
 * Implementation: Uses Zustand state + CSS class strategy (html.dark)
 * rather than CSS variables alone, for better Tailwind dark: prefix support.
 * The toggle animates between sun/moon icons for polished UX.
 */
'use client';

import { useFinanceStore } from '@/store/useFinanceStore';

export default function DarkModeToggle() {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border
        border-gray-200 bg-white text-gray-600 transition-all duration-300
        hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm
        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300
        dark:hover:bg-gray-600 dark:hover:text-white"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      <span
        className={`absolute transition-all duration-300 ${
          darkMode ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      >
        {/* Sun icon */}
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
        }`}
      >
        {/* Moon icon */}
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </span>
    </button>
  );
}
