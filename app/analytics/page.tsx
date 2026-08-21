'use client';

import Link from 'next/link';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { CalendarDays, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { CATEGORY_LABELS, SKILL_LABELS, STAGE_LABELS, plural } from '@/lib/labels';
import { AthleteSkills, CategoryId } from '@/lib/types';

export default function AnalyticsPage() {
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);
  const athletes = useAppStore((s) => s.athletes);
  const groups = useAppStore((s) => s.groups);
  const exercises = useAppStore((s) => s.exercises);
  const programs = useAppStore((s) => s.programs);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const completed = workouts.filter((w) => w.status === 'completed');
  const completionRate =
    workouts.length > 0 ? Math.round((completed.length / workouts.length) * 100) : 0;

  // Exercise usage across workouts
  const usage = new Map<string, number>();
  workouts.forEach((w) =>
    w.blocks.forEach((b) =>
      b.exercises.forEach((we) => usage.set(we.exerciseId, (usage.get(we.exerciseId) ?? 0) + 1))
    )
  );
  const topExercises = [...usage.entries()]
    .map(([id, count]) => ({ ex: exercises.find((e) => e.id === id), count }))
    .filter((x) => x.ex)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const maxUsage = topExercises[0]?.count ?? 1;

  // Category distribution
  const catCount = new Map<CategoryId, number>();
  workouts.forEach((w) =>
    w.blocks.forEach((b) =>
      b.exercises.forEach((we) => {
        const ex = exercises.find((e) => e.id === we.exerciseId);
        if (ex) catCount.set(ex.category, (catCount.get(ex.category) ?? 0) + 1);
      })
    )
  );
  const totalCat = [...catCount.values()].reduce((s, v) => s + v, 0) || 1;

  // Average skills across athletes
  const skillKeys = Object.keys(SKILL_LABELS) as (keyof AthleteSkills)[];
  const avgSkills = skillKeys.map((key) => ({
    key,
    value:
      athletes.length > 0
        ? athletes.reduce((s, a) => s + a.skills[key], 0) / athletes.length
        : 0,
  }));

  // Program progress
  const programStats = programs.map((p) => {
    const months = p.years.flatMap((y) => y.periods).flatMap((pp) => pp.months);
    const avg =
      months.length > 0
        ? Math.round(months.reduce((s, m) => s + m.progress, 0) / months.length)
        : 0;
    return { program: p, progress: avg };
  });

  const CAT_COLORS: Record<CategoryId, string> = {
    kumite: 'bg-brand-500',
    kata: 'bg-ocean-500',
    ofp: 'bg-emerald-500',
    sfp: 'bg-violet-500',
    tactics: 'bg-amber-500',
    psychology: 'bg-pink-500',
  };

  return (
    <PageShell>
      <h1 className="page-title mb-6">Аналитика</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Всего тренировок', value: workouts.length, icon: CalendarDays, color: 'text-ocean-600 bg-ocean-50 dark:bg-ocean-900/30' },
          { label: 'Выполнено', value: completed.length, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Выполнение плана', value: `${completionRate}%`, icon: TrendingUp, color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30' },
          { label: 'Спортсменов', value: athletes.length, icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/30' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 sm:p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Category distribution */}
        <div className="card p-5 sm:p-6">
          <h2 className="section-title mb-1">Направления работы</h2>
          <p className="text-sm text-slate-400 mb-5">Распределение упражнений в тренировках</p>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => {
              const count = catCount.get(c) ?? 0;
              if (count === 0) return null;
              return (
                <div
                  key={c}
                  className={CAT_COLORS[c]}
                  style={{ width: `${(count / totalCat) * 100}%` }}
                  title={CATEGORY_LABELS[c]}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => {
              const count = catCount.get(c) ?? 0;
              return (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${CAT_COLORS[c]}`} />
                  <span className="text-slate-600 dark:text-slate-300">{CATEGORY_LABELS[c]}</span>
                  <span className="ml-auto font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                    {Math.round((count / totalCat) * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top exercises */}
        <div className="card p-5 sm:p-6">
          <h2 className="section-title mb-1">Популярные упражнения</h2>
          <p className="text-sm text-slate-400 mb-5">Сколько раз используются в тренировках</p>
          <div className="space-y-3">
            {topExercises.map(({ ex, count }) => (
              <div key={ex!.id}>
                <div className="flex justify-between text-sm mb-1">
                  <Link href={`/exercises/${ex!.id}`} className="font-medium text-slate-700 dark:text-slate-200 no-underline hover:text-brand-600 truncate">
                    {ex!.name}
                  </Link>
                  <span className="font-bold text-slate-500 tabular-nums shrink-0 ml-3">{count}</span>
                </div>
                <div className="progress-track h-2">
                  <div className="progress-fill-blue" style={{ width: `${(count / maxUsage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Average skills */}
        <div className="card p-5 sm:p-6">
          <h2 className="section-title mb-1">Средние навыки спортсменов</h2>
          <p className="text-sm text-slate-400 mb-5">
            По {athletes.length} {plural(athletes.length, 'спортсмену', 'спортсменам', 'спортсменам')}
          </p>
          <div className="space-y-3">
            {avgSkills.map(({ key, value }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{SKILL_LABELS[key]}</span>
                  <span className="font-bold text-slate-500 tabular-nums">{value.toFixed(1)}</span>
                </div>
                <div className="progress-track h-2">
                  <div className="progress-fill-orange" style={{ width: `${value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program progress */}
        <div className="card p-5 sm:p-6">
          <h2 className="section-title mb-1">Прогресс программ</h2>
          <p className="text-sm text-slate-400 mb-5">Выполнение годовых планов</p>
          <div className="space-y-4">
            {programStats.map(({ program, progress }) => (
              <Link key={program.id} href={`/programs/${program.id}`} className="block no-underline">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{program.name}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">{progress}%</span>
                </div>
                <div className="progress-track h-2.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      program.stage === 'beginner'
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        : program.stage === 'intermediate'
                        ? 'bg-gradient-to-r from-amber-400 to-brand-500'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">По группам</h3>
            <div className="space-y-2">
              {groups.map((g) => {
                const gw = workouts.filter((w) => w.groupId === g.id);
                const gc = gw.filter((w) => w.status === 'completed');
                return (
                  <div key={g.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{g.name}</span>
                    <span className="text-slate-400 tabular-nums">
                      {gc.length}/{gw.length} тренировок
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
