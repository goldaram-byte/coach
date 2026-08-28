'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Lock,
  Crown,
  CalendarRange,
  Dumbbell,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Play,
  Check,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import {
  planPhases,
  planWorkouts,
  planExercises,
  planAssessments,
  planProgress,
  nextPlanWorkout,
} from '@/lib/year1';

const RULES = [
  'Только WKF Kumite; ката не включается.',
  'Контингент — дети-новички первого года обучения.',
  'Суставная разминка обязательна на каждой тренировке.',
  'Разминка всегда сверху вниз: шея → плечи → локти → кисти → позвоночник → тазобедренные → колени → голеностоп → стопы.',
  'В начале года доминирует ОФП; специфичность постепенно растёт.',
  'Сложные перемещения и свободное кумитэ не форсируются.',
  'Уровни L1/L2/L3 выбираются индивидуально для каждого спортсмена.',
  'Качество движения важнее объёма; отказная работа не используется.',
  'Игровое взаимодействие предшествует полноценному соревновательному формату.',
];

export default function PlanPage() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);

  const { done } = hydrated ? planProgress(workouts) : { done: new Set<string>() };
  const next = nextPlanWorkout(done);
  const donePct = Math.round((done.size / planWorkouts.length) * 100);

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="page-title mb-1">Стандартный тренировочный план</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Единая методика клуба — просмотр доступен всем тренерам, изменять её нельзя
        </p>
      </div>

      {/* Раздел 1 */}
      <div className="card p-6 mb-6 border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50/60 to-ocean-50/40 dark:from-brand-900/10 dark:to-ocean-900/10">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Раздел 1
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Начальная подготовка — 1 год обучения (WKF Kumite)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Годовая система подготовки детей-новичков: двигательная грамотность, базовая
              физическая подготовка и подводка к игровому кумитэ. Каждое упражнение имеет три
              уровня сложности L1/L2/L3, которые тренер подбирает индивидуально.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            [CalendarRange, '52', 'недели'],
            [ClipboardCheck, '156', 'тренировок'],
            [Dumbbell, String(planExercises.length), 'упражнение(й)'],
            [ShieldCheck, '4', 'макроцикла'],
          ].map(([Icon, num, label]: any) => (
            <div
              key={label}
              className="bg-white/80 dark:bg-slate-900/60 rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <Icon className="w-5 h-5 text-ocean-500 shrink-0" />
              <div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">
                  {num}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Следующая тренировка по плану */}
      {hydrated && next && (
        <div className="card p-5 mb-6 border-ocean-200 dark:border-ocean-800">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-ocean-600 dark:text-ocean-400 mb-1">
                Ваша следующая тренировка по плану
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white">
                Неделя {next.week} · Занятие {next.session} — {next.theme}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {next.phase} · {next.duration_min} мин · уровень {next.progression}
              </div>
            </div>
            <Link
              href={`/plan-workout?id=${next.id}`}
              className="btn-primary no-underline shrink-0"
            >
              <Play className="w-4 h-4" /> Открыть и провести
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Проведено {done.size} из {planWorkouts.length} тренировок</span>
              <span className="font-bold text-brand-600">{donePct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-ocean-500 transition-all"
                style={{ width: `${Math.max(donePct, done.size > 0 ? 2 : 0)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Неподвижные правила */}
      <div className="card p-5 mb-6">
        <button
          onClick={() => setRulesOpen(!rulesOpen)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-500" /> Неподвижные правила методики
          </span>
          {rulesOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {rulesOpen && (
          <ol className="mt-3 space-y-1.5 list-decimal list-inside text-sm text-slate-600 dark:text-slate-300">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        )}
      </div>

      {/* Макроциклы и недели */}
      <h2 className="section-title mb-3">Макроциклы и недели</h2>
      <div className="space-y-4 mb-8">
        {planPhases.map((phase) => (
          <div key={phase.name} className="card p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${phase.color}`}>
                {phase.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Недели {phase.weeks[0]}–{phase.weeks[phase.weeks.length - 1]} ·{' '}
                {phase.weeks.length * 3} тренировок
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phase.weeks.map((w) => {
                const isAssess = planAssessments.weeks.includes(w);
                const weekDone =
                  hydrated &&
                  planWorkouts
                    .filter((x) => x.week === w)
                    .every((x) => done.has(x.id));
                return (
                  <Link
                    key={w}
                    href={`/plan-week?w=${w}`}
                    title={
                      planWorkouts.find((x) => x.week === w)?.theme +
                      (isAssess ? ' · контрольная неделя' : '') +
                      (weekDone ? ' · проведена' : '')
                    }
                    className={`no-underline relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                      weekDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : isAssess
                        ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-ocean-100 dark:hover:bg-ocean-900/40 hover:text-ocean-700'
                    }`}
                  >
                    {w}
                    {weekDone && (
                      <Check className="w-3 h-3 absolute -top-1 -right-1 bg-white dark:bg-slate-900 text-emerald-500 rounded-full p-[1px]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Контрольные точки */}
      <h2 className="section-title mb-3">Контрольные оценки</h2>
      <div className="card p-5">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          На неделях{' '}
          <span className="font-bold text-brand-600">
            {planAssessments.weeks.join(', ')}
          </span>{' '}
          проводится оценка каждого спортсмена по шкале 1–4. По среднему баллу подбирается
          уровень сложности: &lt;2.0 → L1 · 2.0–2.9 → L1/L2 · 3.0–3.5 → L2 · &gt;3.5 → L2/L3.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {Object.entries(planAssessments.scale).map(([score, label]) => (
            <div
              key={score}
              className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2"
            >
              <span className="w-7 h-7 rounded-lg bg-ocean-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {score}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          Оцениваемые направления
        </div>
        <div className="flex flex-wrap gap-1.5">
          {planAssessments.domains.map((d) => (
            <span
              key={d}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
