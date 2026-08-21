'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hourglass, LogOut, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const init = useAuthStore((s) => s.init);
  const logout = useAuthStore((s) => s.logout);
  const refreshMe = useAuthStore((s) => s.refreshMe);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === 'guest') router.replace('/login/');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 animate-pulse" />
      </div>
    );
  }

  if (status === 'guest') return null;

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="card p-8 max-w-md w-full text-center animate-slide-up">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-brand-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/25">
            <Hourglass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Заявка отправлена
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {user?.name}, ваш аккаунт создан и ожидает подтверждения владельцем.
            Как только доступ откроют, вы сможете пользоваться приложением.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => refreshMe()} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Проверить
            </button>
            <button onClick={() => logout()} className="btn-secondary">
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // authed или offline — показываем приложение
  return <>{children}</>;
}
