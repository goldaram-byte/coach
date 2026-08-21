'use client';

import Link from 'next/link';
import { ChevronRight, Target } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { STAGE_BADGE, STAGE_LABELS, plural } from '@/lib/labels';

const STAGE_ACCENT: Record<string, string> = {
  beginner: 'from-emerald-400 to-emerald-600',
  intermediate: 'from-amber-400 to-brand-500',
  advanced: 'from-red-400 to-red-600',
};

export default function ProgramsPage() {
  const hydrated = useHydrated();
  const programs = useAppStore((s) => s.programs);
  const groups = useAppStore((s) => s.groups);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="page-title">Программы подготовки</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Три этапа многолетней подготовки спортсмена: от первой стойки до высоких результатов
        </p>
      </div>

      <div className="grid gap-4">
        {programs.map((program) => {
          const groupsOnProgram = groups.filter((g) => g.programId === program.id);
          const yearsWithContent = program.years.filter((y) => y.periods.length > 0).length;
          const totalMonths = program.years.flatMap((y) => y.periods).flatMap((p) => p.months);
          const avgProgress =
            totalMonths.length > 0
              ? Math.round(totalMonths.reduce((s, m) => s + m.progress, 0) / totalMonths.length)
              : 0;

          return (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className="card-hover p-0 overflow-hidden no-underline block"
            >
              <div className={`h-1.5 bg-gradient-to-r ${STAGE_ACCENT[program.stage]}`} />
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={STAGE_BADGE[program.stage]}>
                        Этап {program.stage === 'beginner' ? '1' : program.stage === 'intermediate' ? '2' : '3'}
                      </span>
                      <span className="badge-blue">
                        {program.years.length} {plural(program.years.length, 'год', 'года', 'лет')} подготовки
                      </span>
                      {groupsOnProgram.length > 0 && (
                        <span className="badge-gray">
                          {groupsOnProgram.length} {plural(groupsOnProgram.length, 'группа', 'группы', 'групп')}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {program.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {program.description}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> Задачи этапа
                      </p>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                        {program.stageTasks.slice(0, 4).map((task, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"
                          >
                            <span className="text-brand-500 font-bold shrink-0">·</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                </div>

                {totalMonths.length > 0 && (
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Прогресс текущего плана
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                        {avgProgress}%
                      </span>
                    </div>
                    <div className="progress-track h-2">
                      <div className="progress-fill-blue" style={{ width: `${avgProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
