/**
 * DashboardShell — Layout wrapper that manages dark mode class on <html>.
 *
 * Why a separate component?
 * - The dark mode toggle is driven by Zustand (client state), but the `dark`
 *   class must be on <html> for Tailwind's `dark:` variants to work.
 * - This component bridges that gap by syncing Zustand state → DOM class.
 * - Keeps the root layout as a Server Component (better for SEO/performance).
 *
 * Also handles the simulated loading state on initial mount.
 */
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import Sidebar from '@/components/ui/Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // Sync dark mode class with <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle hydration mismatch: wait for client state to be ready
  useEffect(() => {
    setIsHydrated(true);
    // Simulate loading state for polished UX
    const timer = setTimeout(() => setShowLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Prevent flash of unstyled content during hydration
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Small top padding on mobile to avoid hamburger overlap */}
          <div className="pt-12 lg:pt-0">
            {showLoading ? <LoadingSkeleton /> : children}
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
