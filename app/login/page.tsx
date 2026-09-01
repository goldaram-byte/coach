'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiErrorText } from '@/lib/api';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const init = useAuthStore((s) => s.init);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === 'authed' || status === 'offline') router.replace('/');
  }, [status, router]);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (tab === 'login') {
        await login(email.trim(), password);
      } else {
        if (!name.trim()) {
          setError('Укажите имя и фамилию');
          setBusy(false);
          return;
        }
        await register(name.trim(), email.trim(), password);
      }
      // редирект произойдёт через useEffect по смене статуса,
      // pending-экран покажет AuthGate на главной
      router.replace('/');
    } catch (e) {
      setError(apiErrorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-800 via-ocean-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-black text-2xl">空</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            KARATE <span className="text-brand-400">WKF</span> COACH
          </h1>
          <p className="text-ocean-300 text-sm mt-1">
            Система подготовки спортсменов
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            {([
              ['login', 'Вход'],
              ['register', 'Регистрация'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError('');
                }}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="label-base">Имя и фамилия</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Виктор Иванов"
                  className="input-base"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label className="label-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@example.com"
                className="input-base"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label-base">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={tab === 'register' ? 'Минимум 6 символов' : '••••••••'}
                className="input-base"
                autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
                {error}
              </div>
            )}

            <button onClick={submit} disabled={busy} className="btn-primary w-full py-3 text-base">
              {tab === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" /> Войти
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Зарегистрироваться
                </>
              )}
            </button>

            {tab === 'register' && (
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                После регистрации доступ к приложению откроет владелец.
                Вы получите его после подтверждения заявки.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
