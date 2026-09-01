'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { todayISO } from '@/lib/seed';

type Tab = 'upcoming' | 'completed';

export default function WorkoutsPage() {
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);
  const [tab, setTab] = useState<Tab>('upcoming');

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const today = todayISO();
  const upcoming = workouts
    .filter((w) => w.status === 'planned' && w.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const completed = workouts
    .filter((w) => w.status === 'completed' || w.date < today)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="page-title">Тренировки</h1>
        <Link href="/builder" className="btn-primary no-underline">
          <Plus className="w-4 h-4" /> Создать тренировку
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {([
          ['upcoming', `Предстоящие (${upcoming.length})`],
          ['completed', `Прошедшие (${completed.length})`],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              tab === t
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((w) => (
            <WorkoutCard key={w.id} workout={w} showDate />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {tab === 'upcoming' ? 'Запланированных тренировок нет' : 'Прошедших тренировок нет'}
          </p>
          {tab === 'upcoming' && (
            <Link href="/builder" className="btn-primary no-underline">
              Создать тренировку
            </Link>
          )}
        </div>
      )}
    </PageShell>
  );
}
