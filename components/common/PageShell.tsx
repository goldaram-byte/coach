'use client';

import Header from './Header';
import Navigation from './Navigation';
import AuthGate from './AuthGate';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
        <Header />
        <main className="page-container animate-fade-in">{children}</main>
        <Navigation />
      </div>
    </AuthGate>
  );
}
