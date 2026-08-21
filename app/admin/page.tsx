'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Check, Ban, RotateCcw, Crown, Hourglass } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAuthStore } from '@/store/authStore';
import { api, ApiUser, apiErrorText } from '@/lib/api';

type AdminUser = ApiUser & { createdAt: string };

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  active: { label: 'Доступ открыт', cls: 'badge-green' },
  pending: { label: 'Ждёт подтверждения', cls: 'badge-amber' },
  blocked: { label: 'Заблокирован', cls: 'badge-red' },
};

export default function AdminPage() {
  const authStatus = useAuthStore((s) => s.status);
  const me = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.adminUsers();
      setUsers(res.users);
    } catch (e) {
      setError(apiErrorText(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authed' && me?.isAdmin) load();
  }, [authStatus, me?.isAdmin, load]);

  const setStatus = async (id: number, status: 'active' | 'blocked' | 'pending') => {
    try {
      await api.adminSetStatus(id, status);
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, status } : u)));
    } catch (e) {
      alert(apiErrorText(e));
    }
  };

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-brand-500" /> Управление доступом
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Подтверждайте регистрации тренеров и управляйте их доступом
        </p>
      </div>

      {me && !me.isAdmin && (
        <div className="card p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Этот раздел доступен только владельцу.
          </p>
        </div>
      )}

      {authStatus === 'offline' && (
        <div className="card p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Автономный режим — управление доступом недоступно без сервера.
          </p>
        </div>
      )}

      {me?.isAdmin && (
        <>
          {pendingCount > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 flex items-center gap-3">
              <Hourglass className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Новых заявок на подтверждение: {pendingCount}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="card h-32 animate-pulse" />
          ) : (
            <div className="space-y-3">
              {users.map((u) => {
                const badge = STATUS_BADGE[u.status] ?? STATUS_BADGE.pending;
                const isSelf = u.id === me.id;
                return (
                  <div key={u.id} className="card p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center text-white font-bold shrink-0">
                        {u.name
                          .split(' ')
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                          {u.name}
                          {u.isAdmin && (
                            <span className="badge-orange inline-flex items-center gap-1">
                              <Crown className="w-3 h-3" /> Владелец
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={badge.cls}>{badge.label}</span>
                      {!isSelf && (
                        <>
                          {u.status !== 'active' && (
                            <button
                              onClick={() => setStatus(u.id, 'active')}
                              className="btn-primary !py-1.5 text-sm"
                            >
                              <Check className="w-4 h-4" /> Подтвердить
                            </button>
                          )}
                          {u.status === 'active' && (
                            <button
                              onClick={() => {
                                if (confirm(`Закрыть доступ для «${u.name}»?`))
                                  setStatus(u.id, 'blocked');
                              }}
                              className="btn-secondary !py-1.5 text-sm text-red-500"
                            >
                              <Ban className="w-4 h-4" /> Закрыть доступ
                            </button>
                          )}
                          {u.status === 'blocked' && (
                            <button
                              onClick={() => setStatus(u.id, 'active')}
                              className="btn-secondary !py-1.5 text-sm"
                            >
                              <RotateCcw className="w-4 h-4" /> Разблокировать
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {users.length === 0 && !error && (
                <div className="card p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Пока зарегистрированы только вы. Когда тренеры начнут регистрироваться,
                    их заявки появятся здесь.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
