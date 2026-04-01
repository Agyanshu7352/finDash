import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardShell from "@/components/DashboardShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * SEO: Descriptive metadata for the Finance Dashboard.
 * In production, this would be dynamic per-page via generateMetadata.
 */
export const metadata: Metadata = {
  title: "FinDash — Finance Dashboard",
  description:
    "A modern finance dashboard for tracking income, expenses, and financial insights. Built with Next.js, Tailwind CSS, Zustand, and Recharts.",
  keywords: ["finance", "dashboard", "expenses", "income", "budgeting"],
};

/**
 * Root layout — Server Component.
 *
 * The DashboardShell (Client Component) wraps children to provide:
 * - Sidebar navigation
 * - Dark mode sync
 * - Toast notifications
 * - Loading states
 *
 * This pattern keeps the layout itself as a Server Component for
 * optimal initial page load (HTML + fonts streamed from server).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
