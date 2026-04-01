/**
 * Dashboard page (Server Component).
 *
 * This page file is a thin Server Component shell that renders the
 * DashboardContent client component. This pattern is intentional:
 * - The page itself can benefit from server rendering (SEO, initial HTML)
 * - Interactive features (Zustand, charts) are handled by the client component
 * - Future: we could add server-side data fetching here if needed
 */
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  return <DashboardContent />;
}
