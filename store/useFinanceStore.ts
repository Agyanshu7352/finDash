/**
 * Zustand Finance Store — Central state management for the dashboard.
 *
 * Architecture decisions:
 * - Single store with logical slices (transactions, filters, role, UI)
 *   rather than multiple stores. This simplifies cross-slice interactions
 *   (e.g., role changes affecting transaction capabilities).
 *
 * - localStorage persistence via Zustand's `persist` middleware.
 *   Trade-off: Increases initial load time slightly but provides session continuity.
 *
 * - Computed values (totals, insights) are derived in selectors rather than stored,
 *   following the "single source of truth" principle. This prevents stale derived data.
 *
 * - Toast notifications are managed here to allow any action (add/edit/delete)
 *   to trigger feedback without prop drilling callback handlers.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Transaction,
  TransactionFilters,
  UserRole,
  Toast,
  ToastType,
} from '@/types/finance';
import { seedTransactions } from '@/lib/seed-data';
import { generateId } from '@/lib/utils';

interface FinanceState {
  // --- Core Data ---
  transactions: Transaction[];
  role: UserRole;
  filters: TransactionFilters;
  darkMode: boolean;
  isLoading: boolean;

  // --- Toast notifications ---
  toasts: Toast[];

  // --- Transaction Actions ---
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // --- Filter Actions ---
  setSearch: (search: string) => void;
  setTypeFilter: (type: TransactionFilters['type']) => void;
  setSortBy: (sortBy: TransactionFilters['sortBy']) => void;
  toggleSortOrder: () => void;

  // --- Role Actions ---
  setRole: (role: UserRole) => void;

  // --- UI Actions ---
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;

  // --- Toast Actions ---
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

/**
 * The main finance store.
 * Uses Zustand's persist middleware for localStorage sync.
 *
 * Partialize controls which slices get persisted — we exclude
 * ephemeral state like loading and toasts to prevent stale UI on reload.
 */
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      // Initial state
      transactions: seedTransactions,
      role: 'admin',
      filters: {
        search: '',
        type: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
      },
      darkMode: false,
      isLoading: false,
      toasts: [],

      // --- Transaction mutations ---

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: generateId() },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // --- Filter mutations ---

      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
        })),

      setTypeFilter: (type) =>
        set((state) => ({
          filters: { ...state.filters, type },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),

      toggleSortOrder: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
          },
        })),

      // --- Role ---

      setRole: (role) => set({ role }),

      // --- UI ---

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      setLoading: (isLoading) => set({ isLoading }),

      // --- Toasts ---

      addToast: (message, type) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { id: generateId(), message, type },
          ],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'finance-dashboard-storage',
      /**
       * Only persist data that should survive page reloads.
       * Exclude transient UI state (loading, toasts).
       */
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        filters: state.filters,
        darkMode: state.darkMode,
      }),
    }
  )
);

// ========================================
// SELECTORS
// ========================================

/**
 * Selector: Get filtered & sorted transactions.
 *
 * Design: Selectors are pure functions that derive data from state.
 * Using them with Zustand's shallow comparison prevents unnecessary re-renders
 * since components only re-render when their selected slice actually changes.
 */
export function getFilteredTransactions(state: FinanceState): Transaction[] {
  let filtered = [...state.transactions];

  // Apply type filter
  if (state.filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === state.filters.type);
  }

  // Apply search filter (matches against category, description, or amount)
  if (state.filters.search) {
    const query = state.filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.category.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const multiplier = state.filters.sortOrder === 'asc' ? 1 : -1;
    if (state.filters.sortBy === 'date') {
      return (
        multiplier *
        (new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    }
    return multiplier * (a.amount - b.amount);
  });

  return filtered;
}

/** Selector: Total income */
export function getTotalIncome(state: FinanceState): number {
  return state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/** Selector: Total expenses */
export function getTotalExpenses(state: FinanceState): number {
  return state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/** Selector: Total balance (income - expenses) */
export function getTotalBalance(state: FinanceState): number {
  return getTotalIncome(state) - getTotalExpenses(state);
}
