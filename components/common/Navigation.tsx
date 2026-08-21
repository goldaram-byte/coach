'use client';

import { Home, BookOpen, Dumbbell, CalendarDays, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/programs', icon: BookOpen, label: 'Программы' },
    { href: '/calendar', icon: CalendarDays, label: 'Календарь' },
    { href: '/exercises', icon: Dumbbell, label: 'Упражнения' },
    { href: '/analytics', icon: BarChart3, label: 'Аналитика' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-100 dark:border-slate-800 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center py-2.5 text-[11px] font-medium no-underline transition-colors ${
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {active && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600" />
              )}
              <Icon className="w-5 h-5 mb-0.5" strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
