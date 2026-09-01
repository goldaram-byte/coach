'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardCheck,
  Layers,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import {
  planWeekWorkouts,
  phaseOfWeek,
  planAssessments,
  planProgress,
  PLAN_BLOCK_LABELS,
} from '@/lib/year1';

function PlanWeekInner() {
  const params = useSearchParams();
  const week = Math.min(52, Math.max(1, parseInt(params.get('w') ?? '1', 10) || 1));
  const workouts = planWeekWorkouts(week);
  const phase = phaseOfWeek(week);
  const isAssess = planAssessments.weeks.includes(week);
  const hydrated = useHydrated();
  const myWorkouts = useAppStore((s) => s.workouts);
  const { done, planned } = hydrated
    ? planProgress(myWorkouts)
    : { done: new Set<string>(), planned: new Set<string>() };

  return (
    <PageShell>
      <Link href="/" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ArrowLeft className="w-4 h-4" /> К плану
      </Link>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h1 className="page-title">Неделя {week}</h1>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/plan-week?w=${Math.max(1, week - 1)}`}
            aria-disabled={week === 1}
            className={`no-underline p-2 rounded-xl border border-slate-200 dark:border-slate-700 ${
              week === 1
                ? 'opacity-40 pointer-events-none'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            } text-slate-600 dark:text-slate-300`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link
            href={`/plan-week?w=${Math.min(52, week + 1)}`}
            aria-disabled={week === 52}
            className={`no-underline p-2 rounded-xl border border-slate-200 dark:border-slate-700 ${
              week === 52
                ? 'opacity-40 pointer-events-none'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            } text-slate-600 dark:text-slate-300`}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        {phase && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${phase.color}`}>
            {phase.name}
          </span>
        )}
        {workouts[0] && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {workouts[0].theme}
          </span>
        )}
      </div>

      {isAssess && (
        <div className="card p-4 mb-6 border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-900/10 flex items-start gap-3">
          <ClipboardCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <span className="font-bold">Контрольная неделя.</span> Проведите оценку каждого
            спортсмена по шкале 1–4 и при необходимости скорректируйте уровни L1/L2/L3.
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workouts.map((w) => (
          <Link
            key={w.id}
            href={`/plan-workout?id=${w.id}`}
            className="card p-5 block no-underline hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-white font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-ocean-600/25">
                  {w.session}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    Занятие {w.session} · {w.theme}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {w.duration_min} мин
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> {w.blocks.length}{' '}
                      блоков
                    </span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {w.progression}
                    </span>
                    {done.has(w.id) && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Проведена
                      </span>
                    )}
                    {!done.has(w.id) && planned.has(w.id) && (
                      <span className="flex items-center gap-1 font-semibold text-ocean-600 dark:text-ocean-400">
                        <CalendarClock className="w-3.5 h-3.5" /> Запланирована
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[45%]">
                {w.blocks
                  .filter((b) => b.type !== 'organization')
                  .map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      {PLAN_BLOCK_LABELS[b.type] ?? b.type}
                    </span>
                  ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

export default function PlanWeekPage() {
  return (
    <Suspense fallback={null}>
      <PlanWeekInner />
    </Suspense>
  );
}
