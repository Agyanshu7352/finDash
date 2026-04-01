/**
 * Transactions page (Server Component shell).
 *
 * Metadata is set here for SEO, while the interactive content
 * is rendered by the TransactionsContent client component.
 */
import type { Metadata } from 'next';
import TransactionsContent from '@/components/TransactionsContent';

export const metadata: Metadata = {
  title: 'Transactions — FinDash',
  description: 'View, search, filter, and manage your financial transactions.',
};

export default function TransactionsPage() {
  return <TransactionsContent />;
}
