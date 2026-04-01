/**
 * TransactionTable — Full-featured sortable, filterable transaction list.
 *
 * Design decisions:
 * - Uses the store's filtered transaction selector for data
 * - Inline edit/delete actions visible only for Admin role
 * - Responsive: switches from table to card layout on mobile
 * - Hover states and transition animations for polished feel
 */
'use client';

import { useState, useMemo } from 'react';
import {
  useFinanceStore,
} from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import TransactionModal from '@/components/transactions/TransactionModal';
import { Transaction, TransactionFilters } from '@/types/finance';
import { sortTransactions } from '@/utils/sort';

/**
 * Fix: We read raw state pieces and derive filtered transactions via useMemo
 * instead of passing getFilteredTransactions as a Zustand selector.
 * Zustand selectors must return referentially stable values; array-producing
 * selectors create new references each call, triggering infinite re-renders.
 */
export default function TransactionTable() {
  const role = useFinanceStore((s) => s.role);
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const addToast = useFinanceStore((s) => s.addToast);
  const setSortBy = useFinanceStore((s) => s.setSortBy);
  const toggleSortOrder = useFinanceStore((s) => s.toggleSortOrder);

  const handleSort = (column: TransactionFilters['sortBy']) => {
    if (filters.sortBy === column) {
      toggleSortOrder();
    } else {
      setSortBy(column);
    }
  };

  const renderSortableHeader = (label: string, column: TransactionFilters['sortBy'], alignRight = false) => {
    const isActive = filters.sortBy === column;
    const isAsc = filters.sortOrder === 'asc';

    return (
      <th
        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors
          hover:text-gray-900 cursor-pointer select-none dark:text-gray-400 dark:hover:text-white group
          ${alignRight ? 'text-right' : 'text-left'}`}
        onClick={() => handleSort(column)}
      >
        <div className={`flex items-center gap-1.5 inline-flex ${alignRight ? 'justify-end w-full' : ''}`}>
          <span className={isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
            {label}
          </span>
          <div className="flex flex-col opacity-70">
            <svg
              className={`h-2.5 w-2.5 ${isActive && isAsc ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'} ${!isActive ? 'group-hover:text-gray-400' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <svg
              className={`h-2.5 w-2.5 -mt-1 ${isActive && !isAsc ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'} ${!isActive ? 'group-hover:text-gray-400' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </th>
    );
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Apply search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
      );
    }

    // Apply robust, stable sorting logic from separated utility
    return sortTransactions(filtered, filters.sortBy, filters.sortOrder);
  }, [transactions, filters]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    addToast('Transaction deleted', 'success');
  };

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description={
          role === 'admin'
            ? 'Add your first transaction to get started.'
            : 'No transactions match your current filters.'
        }
        showAction={role === 'admin'}
        onAction={() => setShowAddModal(true)}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700/50 dark:bg-gray-800/80 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {renderSortableHeader('Date', 'date')}
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Description
              </th>
              {renderSortableHeader('Category', 'category')}
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              {renderSortableHeader('Amount', 'amount', true)}
              {role === 'admin' && (
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {filteredTransactions.map((t) => (
              <tr
                key={t.id}
                className="group transition-colors duration-150 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(t.date)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {t.description}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold
                      ${
                        t.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                  >
                    {t.type === 'income' ? '↗ Income' : '↙ Expense'}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-6 py-4 text-right text-sm font-bold
                    ${
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </td>
                {role === 'admin' && (
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingTransaction(t)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                        title="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700/50 dark:bg-gray-800/80"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t.description}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(t.date)} · {t.category}
                </p>
              </div>
              <div className="text-right">
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
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold
                    ${
                      t.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                  {t.type}
                </span>
              </div>
            </div>
            {role === 'admin' && (
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <button
                  onClick={() => setEditingTransaction(t)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {/* Add modal */}
      {showAddModal && (
        <TransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
