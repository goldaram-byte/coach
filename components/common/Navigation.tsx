'use client';

import { Home, BookOpen, Users, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/programs', icon: BookOpen, label: 'Программы' },
    { href: '/workouts', icon: Calendar, label: 'Тренировки' },
    { href: '/exercises', icon: Users, label: 'Упражнения' },
    { href: '/analytics', icon: BarChart3, label: 'Аналитика' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
