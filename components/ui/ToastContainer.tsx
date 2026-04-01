/**
 * ToastContainer — Renders stacked toast notifications.
 *
 * Design: Positioned fixed at bottom-right for non-intrusive feedback.
 * Uses auto-dismiss with 3-second timeout. Animations via CSS transitions.
 *
 * Trade-off: We use a simple setTimeout approach rather than a
 * complex animation library. This keeps the bundle small while
 * still providing good UX.
 */
'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function ToastContainer() {
  const toasts = useFinanceStore((s) => s.toasts);
  const removeToast = useFinanceStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: string;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const bgClass =
    type === 'success'
      ? 'bg-emerald-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`${bgClass} flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium
        text-white shadow-lg animate-in slide-in-from-right-full duration-300`}
      role="alert"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
        {iconMap[type] || 'ℹ'}
      </span>
      {message}
      <button
        onClick={() => onDismiss(id)}
        className="ml-2 rounded-full p-0.5 transition-colors hover:bg-white/20"
        aria-label="Dismiss"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
