# FinDash — Modern Finance Dashboard

A production-ready, highly interactive Finance Dashboard built for showcasing advanced frontend engineering practices, thoughtful UI/UX design, and modular architecture.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4 (with custom CSS variables for themes)
- **State Management:** Zustand (with LocalStorage persistence)
- **Data Visualization:** Recharts
- **Language:** TypeScript

---

## 🧠 My Approach

My core philosophy for this project was **"Build for production, not just a prototype."** 

I approached the dashboard by first mapping out the necessary domain entities in `types/finance.ts` to ensure strict typing across the entire app. From there, I focused on:
1. **Modularity:** Breaking the UI down into reusable, highly focused components (`SummaryCard`, `TransactionTable`, `RoleSwitcher`).
2. **Derive, Don't Duplicate:** Instead of storing multiple intersecting points of state (like `totalIncome`, `totalExpenses`), I stored the raw `transactions` array and used computationally inexpensive selectors (`useMemo` and pure functions) to derive metrics on-the-fly.
3. **Progressive Enhancement:** Utilizing Next.js Server Components for the initial shell and SEO metadata, then progressively hydrating interactive Client Components where Zustand and Recharts are needed.

---

## 🏗️ Design Decisions

### 1. Server vs. Client Component Architecture
- **Server Components:** The root layouts (`layout.tsx`) and page shells (`page.tsx`) remain Server Components. This guarantees faster initial document loads and better SEO.
- **Client Components:** Anything requiring interactivity, browser APIs, or Zustand state (`DashboardShell`, `TransactionTable`, `Charts`) uses the `'use client'` directive. 

### 2. Extracted Business Logic
I kept business logic decoupled from the UI layer. For instance, the multi-field sorting mechanism (Date, Amount, Category) is isolated in a pure, easily testable function (`utils/sort.ts`). This ensures the `TransactionTable` component remains focused strictly on rendering data.

### 3. Role-Based Access Control (Frontend)
To demonstrate conditional UI rendering, I implemented a simulated "Admin" vs. "Viewer" toggle. The Viewer role gracefully downgrades the UI by hiding mutation actions (Add, Edit, Delete) and rendering a warning banner, proving the application can adapt securely to user permission boundaries.

### 4. Custom Dark Mode Implementation
Tailwind CSS v4 defaults to `@media (prefers-color-scheme: dark)`. Because we needed a user-controlled toggle, I explicitly configured Tailwind to use the class-based dark mode (`@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`) synchronized with a Zustand state property (`darkMode`), which is then injected into the `<html>` tag via the `DashboardShell`.

---

## 🐻 Why I Chose Zustand over Redux

While Redux is a powerful and proven tool, I deliberately chose **Zustand** for this project for several compelling reasons:

1. **Zero Boilerplate:** Zustand eliminates the need for creating action types, action creators, reducers, and context providers. Direct hook usage makes the codebase cleaner and vastly easier to read.
2. **Bundle Size:** Zustand is significantly lighter than Redux Toolkit, minimizing the JavaScript payload sent to the client.
3. **Frictionless Persistence:** Synchronizing state to `localStorage` (so transactions and themes survive refreshing) was effortlessly achieved using Zustand's built-in `persist` middleware. 
4. **Selective Persistence (Partialize):** Zustand allowed me to easily persist core data (transactions, filters) while willfully ignoring ephemeral UI state (loading states, toast notification queues) so the user doesn't load into a stale toast notification from 3 days ago.

---

## ⚖️ Trade-offs

Engineering is about making informed compromises. Here are the trade-offs made in this architecture:

- **Client-Side Filtering/Sorting vs. Server-Side:** Currently, the entire transaction list is loaded into memory, heavily filtered, and sorted completely in the browser.
  - *Pro:* Incredibly fast, zero-latency UX for lists < 5,000 items.
  - *Con:* Not scalable to millions of rows. It would eventually require a backend paginated API (`?page=1&limit=50&sortBy=amount`).
- **LocalStorage Data Persistence:** 
  - *Pro:* Allowed building a "working" demo with fully persistent CRUD operations without standing up a database.
  - *Con:* Data is trapped in the current browser. It cannot sync between desktop and mobile devices.
- **Frontend Authorized State:** The Admin/Viewer separation is cosmetic. Without a backend validating session tokens, the API (if connected) remains exposed.

---

## 🔭 Future Improvements

If I were to scale this dashboard for real-world production, the immediate roadmap would be:

1. **Actual Backend & Database:** Integrate **PostgreSQL via Prisma ORM** and create standard Next.js Route Handlers to persist transactions genuinely.
2. **Authentication:** Integrate **NextAuth.js (Auth.js)** for real log-ins, session management, and server-side route protection.
3. **Data Virtualization:** Implement `@tanstack/react-virtual` in the `TransactionTable` to handle rendering 10,000+ local rows flawlessly without DOM bloat.
4. **E2E Testing:** Add a suite of **Playwright** tests to programmatically verify critical user flows (e.g., adding a transaction correctly updates the Balance Trend chart).
5. **Data Export:** Build a utility allowing users to download their filtered view as a CSV or Excel file.

---

## ⚙️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
