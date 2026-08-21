'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🥋</span>
              </div>
              <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">
                KARATE WKF COACH
              </h1>
              <h1 className="sm:hidden text-lg font-bold text-gray-900 dark:text-white">
                COACH
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Главная
            </a>
            <a href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Программы
            </a>
            <a href="/exercises" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Упражнения
            </a>
            <a href="/groups" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Группы
            </a>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                ТВ
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Тренер Виктор
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  тренер
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4">
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
              Главная
            </a>
            <a href="/programs" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
              Программы
            </a>
            <a href="/exercises" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
              Упражнения
            </a>
            <a href="/groups" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
              Группы
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
