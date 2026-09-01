'use client';

import { Menu, X, ChevronDown, LogOut, ShieldCheck, Cloud, CloudOff, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/', label: 'План' },
  { href: '/workouts', label: 'Тренировки' },
  { href: '/exercises', label: 'Упражнения' },
  { href: '/groups', label: 'Группы' },
];

const MORE_ITEMS = [
  { href: '/athletes', label: 'Спортсмены' },
  { href: '/calendar', label: 'Календарь' },
  { href: '/builder', label: 'Конструктор' },
  { href: '/blocks', label: 'Блоки' },
  { href: '/programs', label: 'Программы' },
  { href: '/competitions', label: 'Соревнования' },
  { href: '/analytics', label: 'Аналитика' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const authStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const saveStatus = useAuthStore((s) => s.saveStatus);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const initials = user
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ТР';

  const handleLogout = async () => {
    await logout();
    router.replace('/login/');
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30">
              <span className="text-white font-black text-base leading-none">空</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
                KARATE <span className="text-brand-500">WKF</span>
              </div>
              <div className="text-[10px] font-semibold tracking-[0.25em] text-ocean-600 dark:text-ocean-400 uppercase">
                Coach
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap no-underline transition-colors ${
                  isActive(item.href)
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  MORE_ITEMS.some((i) => isActive(i.href))
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ещё <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 min-w-[180px] animate-fade-in">
                    {MORE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2 text-sm font-medium no-underline ${
                          isActive(item.href)
                            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sync indicator */}
            {authStatus === 'authed' && (
              <span
                className="p-2 text-slate-400"
                title={
                  saveStatus === 'saving'
                    ? 'Сохранение…'
                    : saveStatus === 'error'
                    ? 'Ошибка сохранения — проверьте соединение'
                    : 'Данные сохранены на сервере'
                }
              >
                {saveStatus === 'saving' ? (
                  <UploadCloud className="w-4 h-4 animate-pulse text-ocean-500" />
                ) : saveStatus === 'error' ? (
                  <CloudOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Cloud className="w-4 h-4 text-emerald-500" />
                )}
              </span>
            )}
            {authStatus === 'offline' && (
              <span className="p-2 text-slate-400" title="Автономный режим — данные хранятся только в этом браузере">
                <CloudOff className="w-4 h-4" />
              </span>
            )}

            {user?.isAdmin && (
              <Link
                href="/admin"
                title="Управление доступом"
                className={`p-2 rounded-lg no-underline transition-colors ${
                  isActive('/admin')
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
            )}

            <div
              className="w-9 h-9 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-ocean-600/30"
              title={user ? `${user.name} · ${user.email}` : 'Тренер'}
            >
              {initials}
            </div>

            {authStatus === 'authed' && (
              <button
                onClick={handleLogout}
                title="Выйти"
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-2 grid grid-cols-2 gap-1 animate-fade-in">
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  isActive(item.href)
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium no-underline text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Доступ тренеров
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
