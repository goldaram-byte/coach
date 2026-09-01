'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Target, Moon, Plus, CalendarDays } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import {
  STAGE_BADGE,
  STAGE_LABELS,
  PERIOD_BADGE,
  PERIOD_LABELS,
  WEEKDAY_LABELS,
  plural,
  weekdayOfISO,
} from '@/lib/labels';
import { weekdayDate } from '@/lib/seed';
import { TrainingMonthPlan, TrainingWeekPlan } from '@/lib/types';

function ProgramDetailInner() {
  const programId = useSearchParams().get('id') ?? '';
  const hydrated = useHydrated();
  const programs = useAppStore((s) => s.programs);
  const workouts = useAppStore((s) => s.workouts);
  const groups = useAppStore((s) => s.groups);

  const program = programs.find((p) => p.id === programId);

  const [yearId, setYearId] = useState<string | null>(null);
  const [month, setMonth] = useState<TrainingMonthPlan | null>(null);
  const [week, setWeek] = useState<TrainingWeekPlan | null>(null);

  const activeYear = useMemo(() => {
    if (!program) return null;
    return program.years.find((y) => y.id === yearId) ?? program.years[0] ?? null;
  }, [program, yearId]);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  if (!program)
    return (
      <PageShell>
        <p className="text-slate-500">Программа не найдена.</p>
        <Link href="/programs" className="btn-secondary mt-4 no-underline">
          ← К программам
        </Link>
      </PageShell>
    );

  const programGroupIds = groups.filter((g) => g.programId === program.id).map((g) => g.id);

  const goBack = () => {
    if (week) setWeek(null);
    else if (month) setMonth(null);
  };

  return (
    <PageShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
        <Link href="/programs" className="no-underline text-slate-500 hover:text-brand-600">
          Программы
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => { setMonth(null); setWeek(null); }} className="hover:text-brand-600">
          {program.name}
        </button>
        {month && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => setWeek(null)} className="hover:text-brand-600">
              {month.name}
            </button>
          </>
        )}
        {week && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              Неделя {week.number}
            </span>
          </>
        )}
      </div>

      {(month || week) && (
        <button onClick={goBack} className="btn-ghost mb-4 -ml-2">
          <ChevronLeft className="w-4 h-4" /> Назад
        </button>
      )}

      {/* ============ WEEK VIEW ============ */}
      {week && month && (
        <div className="animate-slide-up">
          <div className="mb-6">
            <span className={STAGE_BADGE[program.stage]}>{STAGE_LABELS[program.stage]}</span>
            <h1 className="page-title mt-2">
              Неделя {week.number}: {week.theme}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {month.name} · {program.name}
            </p>
          </div>

          <div className="space-y-3">
            {week.days.map((day) => {
              const dateOfDay = weekdayDate(day.weekday);
              const dayWorkouts = workouts.filter(
                (w) =>
                  weekdayOfISO(w.date) === day.weekday &&
                  w.groupId &&
                  programGroupIds.includes(w.groupId) &&
                  w.date === dateOfDay
              );
              return (
                <div key={day.id} className={`card p-5 ${day.rest ? 'opacity-70' : ''}`}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                          day.rest
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : 'bg-gradient-to-br from-ocean-500 to-ocean-700 text-white shadow-md shadow-ocean-600/25'
                        }`}
                      >
                        {day.rest ? <Moon className="w-5 h-5" /> : WEEKDAY_LABELS[day.weekday].slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {WEEKDAY_LABELS[day.weekday]}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{day.focus}</p>
                      </div>
                    </div>
                    {!day.rest && (
                      <Link
                        href={`/builder?date=${dateOfDay}&theme=${encodeURIComponent(day.focus)}&stage=${program.stage}`}
                        className="btn-ghost text-sm no-underline"
                      >
                        <Plus className="w-4 h-4" /> Тренировка
                      </Link>
                    )}
                  </div>

                  {dayWorkouts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {dayWorkouts.map((w) => (
                        <Link
                          key={w.id}
                          href={`/workout?id=${w.id}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ocean-50 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/40 no-underline hover:bg-ocean-100 dark:hover:bg-ocean-900/30 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-ocean-700 dark:text-ocean-300 tabular-nums mr-2">
                              {w.time}
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {w.theme}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-ocean-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ MONTH VIEW ============ */}
      {month && !week && (
        <div className="animate-slide-up">
          <div className="mb-6">
            <span className={STAGE_BADGE[program.stage]}>{STAGE_LABELS[program.stage]}</span>
            <h1 className="page-title mt-2">{month.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{month.directions}</p>
          </div>

          <div className="card p-5 sm:p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Цели месяца
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
              {month.goals.map((g, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
                  <span className="text-brand-500 font-bold shrink-0">•</span> {g}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">
                План: {month.workoutsPlanned}{' '}
                {plural(month.workoutsPlanned, 'тренировка', 'тренировки', 'тренировок')}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {month.progress}%
              </span>
            </div>
            <div className="progress-track h-2.5">
              <div className="progress-fill-orange" style={{ width: `${month.progress}%` }} />
            </div>
          </div>

          <h2 className="section-title mb-4">Недели месяца</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {month.weeks.map((w) => (
              <button
                key={w.id}
                onClick={() => setWeek(w)}
                className="card-hover p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-400">
                      Неделя {w.number}
                    </p>
                    <h3 className="font-bold text-slate-900 dark:text-white mt-1">{w.theme}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {w.days.filter((d) => !d.rest).length} тренировочных дней
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============ PROGRAM / YEAR VIEW ============ */}
      {!month && !week && (
        <div className="animate-slide-up">
          <div className="mb-6">
            <span className={STAGE_BADGE[program.stage]}>{STAGE_LABELS[program.stage]}</span>
            <h1 className="page-title mt-2">{program.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{program.description}</p>
          </div>

          {/* Stage tasks */}
          <div className="card p-5 sm:p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Задачи этапа
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {program.stageTasks.map((t, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
                  <span className="text-brand-500 font-bold shrink-0">•</span> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Year tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {program.years.map((y) => (
              <button
                key={y.id}
                onClick={() => setYearId(y.id)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeYear?.id === y.id
                    ? 'bg-gradient-to-r from-ocean-600 to-ocean-700 text-white shadow-md shadow-ocean-600/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-ocean-400'
                }`}
              >
                {y.number} год
              </button>
            ))}
          </div>

          {activeYear && (
            <>
              <div className="card p-5 mb-6 bg-gradient-to-r from-ocean-50 to-white dark:from-ocean-950/40 dark:to-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-400 mb-2">
                  Годовой план · {activeYear.number} год подготовки
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeYear.goals.map((g, i) => (
                    <span key={i} className="badge-blue">{g}</span>
                  ))}
                </div>
              </div>

              {activeYear.periods.length === 0 ? (
                <div className="card p-8 text-center">
                  <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    План этого года ещё не заполнен. Методическая программа появится здесь.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeYear.periods.map((period) => (
                    <div key={period.id}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={PERIOD_BADGE[period.type]}>
                          {PERIOD_LABELS[period.type]} период
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white">{period.name}</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {period.months.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setMonth(m)}
                            className="card-hover p-5 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-slate-900 dark:text-white">{m.name}</h4>
                              <span className="text-xs font-bold text-slate-400 tabular-nums">
                                {m.progress}%
                              </span>
                            </div>
                            <div className="progress-track h-1.5 mb-3">
                              <div
                                className="progress-fill-orange"
                                style={{ width: `${m.progress}%` }}
                              />
                            </div>
                            <ul className="space-y-1">
                              {m.goals.slice(0, 3).map((g, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-slate-500 dark:text-slate-400 flex gap-1.5"
                                >
                                  <span className="text-brand-500 shrink-0">•</span> {g}
                                </li>
                              ))}
                            </ul>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </PageShell>
  );
}

export default function ProgramDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProgramDetailInner />
    </Suspense>
  );
}
