/**
 * Sorting utilities for the Finance Dashboard.
 *
 * Implements a stable sorting system handling Dates, Amounts, and Category strings,
 * ensuring robust fallback ordering on transaction IDs so UI changes are predictable
 * and not jittery when sorting fields with identical values.
 */
import { Transaction, TransactionFilters } from '@/types/finance';

export function sortTransactions(
  transactions: Transaction[],
  sortBy: TransactionFilters['sortBy'],
  sortOrder: TransactionFilters['sortOrder']
): Transaction[] {
  // Sort mutates directly, so we use a slice of the array to maintain immutability.
  // Because the caller often already pre-clones or filters, this is just extra safety.
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        // Sort dates chronologically
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        comparison = timeA - timeB;
        break;

      case 'amount':
        // Numerical sort
        comparison = (a.amount || 0) - (b.amount || 0);
        break;

      case 'category':
        // String alphabetical sort, case-insensitive
        comparison = (a.category || '').localeCompare(b.category || '');
        break;

      default:
        comparison = 0;
    }

    // Stable sort fallback: Ensures consistency when values match, 
    // eliminating unpredictable visual rearrangement.
    if (comparison === 0) {
      comparison = a.id.localeCompare(b.id);
    }

    // Reverse orientation if descending
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
