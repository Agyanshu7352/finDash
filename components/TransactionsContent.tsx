/**
 * TransactionsContent — Client component for the transactions page.
 *
 * Combines the filter bar, table, and add transaction button.
 * Role-based: Add button only visible for Admin users.
 */
'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionModal from '@/components/transactions/TransactionModal';

export default function TransactionsContent() {
  const role = useFinanceStore((s) => s.role);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {role === 'admin'
              ? 'Manage and track all your transactions'
              : 'View your transaction history'}
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500
              to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg
              transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        )}
      </div>

      {/* Viewer mode banner */}
      {role === 'viewer' && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
          <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-semibold">Viewer mode:</span> You can browse transactions but cannot make changes. Switch to Admin role to edit.
          </p>
        </div>
      )}

      {/* Filters */}
      <TransactionFilters />

      {/* Table */}
      <TransactionTable />

      {/* Add modal */}
      {showAddModal && (
        <TransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
