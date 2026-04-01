/**
 * Insights page (Server Component shell).
 *
 * Renders financial analytics and computed insights.
 * The heavy computation (aggregation, comparisons) happens
 * client-side in InsightsContent for reactive updates.
 */
import type { Metadata } from 'next';
import InsightsContent from '@/components/InsightsContent';

export const metadata: Metadata = {
  title: 'Insights — FinDash',
  description:
    'Analyze your spending patterns, monthly comparisons, and savings trends.',
};

export default function InsightsPage() {
  return <InsightsContent />;
}
