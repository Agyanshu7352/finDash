/**
 * TransactionModal — Add/Edit transaction form.
 *
 * Design decisions:
 * - Modal overlay pattern for focused interaction without leaving context
 * - Form validation with clear error states
 * - Dynamic category options based on transaction type (income vs expense)
 * - Accessible: focus trap via overlay click-to-close, escape key support
 *
 * Trade-off: We use a controlled form with useState rather than a form library
 * (react-hook-form) to keep dependencies minimal. For a production app with
 * more complex forms, a form library would be beneficial.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Transaction, TransactionType, Category } from '@/types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils';

interface TransactionModalProps {
  transaction?: Transaction;
  onClose: () => void;
}

export default function TransactionModal({
  transaction,
  onClose,
}: TransactionModalProps) {
  const isEditing = !!transaction;
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const addToast = useFinanceStore((s) => s.addToast);

  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    amount: transaction?.amount?.toString() || '',
    category: transaction?.category || ('' as Category | ''),
    type: transaction?.type || ('expense' as TransactionType),
    description: transaction?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Close on Escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Reset category when type changes (income/expense have different categories)
  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, category: '' }));
    }
  }, [formData.type, isEditing]);

  const categories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (!formData.category) newErrors.category = 'Select a category';
    if (!formData.description.trim())
      newErrors.description = 'Enter a description';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category as Category,
      type: formData.type,
      description: formData.description.trim(),
    };

    if (isEditing && transaction) {
      updateTransaction(transaction.id, data);
      addToast('Transaction updated successfully', 'success');
    } else {
      addTransaction(data);
      addToast('Transaction added successfully', 'success');
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6
          shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Type
            </label>
            <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-700">
              {(['expense', 'income'] as TransactionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all duration-200
                    ${
                      formData.type === type
                        ? type === 'income'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none
                transition-all dark:bg-gray-700 dark:text-white
                ${
                  errors.amount
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100 dark:border-red-500'
                    : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:focus:border-indigo-500'
                }`}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none
                transition-all dark:bg-gray-700 dark:text-white
                ${
                  errors.date
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:focus:border-indigo-500'
                }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as Category })
              }
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none
                transition-all dark:bg-gray-700 dark:text-white
                ${
                  errors.category
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:focus:border-indigo-500'
                }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What is this transaction for?"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none
                transition-all dark:bg-gray-700 dark:text-white
                ${
                  errors.description
                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:focus:border-indigo-500'
                }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium
                text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600
                dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4
                py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200
                hover:shadow-xl hover:-translate-y-0.5"
            >
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
