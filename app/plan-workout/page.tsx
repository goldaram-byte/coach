'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  CopyPlus,
  AlertTriangle,
  Target,
  CheckCircle2,
  Link2,
  Play,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { todayISO } from '@/lib/seed';
import {
  planWorkoutById,
  planExerciseById,
  phaseOfWeek,
  convertPlanWorkout,
  findPlanCopy,
  progressionLevels,
  expandExerciseIds,
  PLAN_BLOCK_LABELS,
  PLAN_CATEGORY_LABELS,
  PlanExercise,
} from '@/lib/year1';

function ExerciseCard({
  ex,
  progression,
  index,
}: {
  ex: PlanExercise;
  progression: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const lvls = progressionLevels(progression);
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-ocean-100 dark:bg-ocean-900/50 text-ocean-700 dark:text-ocean-300 text-xs font-bold flex items-center justify-center shrink-0">
            {index}
          </span>
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {ex.name}
          </span>
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-900/40 text-ocean-700 dark:text-ocean-300">
            {PLAN_CATEGORY_LABELS[ex.category] ?? ex.category}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          <div className="bg-white dark:bg-slate-900/60 rounded-lg px-3 py-2.5">
            <div className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mb-0.5">
              Как выполняет группа
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              {lvls.length === 1
                ? ex.levels[lvls[0]]
                : `${ex.levels[lvls[0]]} → по мере освоения: ${ex.levels[lvls[lvls.length - 1]]}`}
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Критерии качества:</span>{' '}
              {ex.quality_criteria.join(', ')}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Типичные ошибки:</span>{' '}
              {ex.common_errors.join(', ')}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Target className="w-3.5 h-3.5 text-ocean-500 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Связь с кумитэ:</span> {ex.kumite_link}
            </span>
          </div>
          {ex.prerequisites.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Link2 className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">Сначала освоить:</span>{' '}
                {ex.prerequisites
                  .map((p) => planExerciseById[p]?.name ?? p)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanWorkoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id') ?? '';
  const pw = planWorkoutById(id);

  const addWorkout = useAppStore((s) => s.addWorkout);
  const upsertExercises = useAppStore((s) => s.upsertExercises);
  const myWorkouts = useAppStore((s) => s.workouts);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('18:00');
  const [adding, setAdding] = useState(false);

  if (!pw)
    return (
      <PageShell>
        <div className="card p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Тренировка не найдена</p>
          <Link href="/" className="btn-primary no-underline">
            К стандартному плану
          </Link>
        </div>
      </PageShell>
    );

  const phase = phaseOfWeek(pw.week);
  const existingCopy = findPlanCopy(myWorkouts, pw.id);

  const makeCopy = (d: string, t: string) => {
    const { exercises, workout } = convertPlanWorkout(pw, d, t);
    upsertExercises(exercises);
    addWorkout(workout);
    return workout;
  };

  // Провести прямо сейчас: берём существующую незавершённую копию
  // или создаём новую на сегодня и открываем режим проведения.
  const handleRunNow = () => {
    setAdding(true);
    const target =
      existingCopy && existingCopy.status !== 'completed'
        ? existingCopy
        : makeCopy(todayISO(), new Date().toTimeString().slice(0, 5));
    router.push(`/run?id=${target.id}`);
  };

  const handleAdd = () => {
    setAdding(true);
    const workout = makeCopy(date, time);
    router.push(`/workout?id=${workout.id}`);
  };

  return (
    <PageShell>
      <Link
        href={`/plan-week?w=${pw.week}`}
        className="btn-ghost -ml-2 mb-4 no-underline inline-flex"
      >
        <ArrowLeft className="w-4 h-4" /> Неделя {pw.week}
      </Link>

      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <h1 className="page-title">
          Занятие {pw.session} · {pw.theme}
        </h1>
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        {phase && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${phase.color}`}>
            {phase.name}
          </span>
        )}
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {pw.duration_min} мин
        </span>
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
          Уровень группы: {pw.progression}
        </span>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-5">
        <Lock className="w-3 h-3" /> Стандартный план, раздел 1 — изменению не подлежит
      </p>

      {pw.coach_note && (
        <div className="card p-4 mb-6 border-ocean-200 dark:border-ocean-800 bg-ocean-50/60 dark:bg-ocean-900/10 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-bold">Заметка тренеру:</span> {pw.coach_note}
        </div>
      )}

      {/* Провести или запланировать */}
      <div className="card p-4 mb-6">
        {existingCopy?.status === 'completed' && (
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4" /> Эта тренировка уже проведена
          </p>
        )}
        <div className="flex items-end gap-3 flex-wrap">
          <button
            onClick={handleRunNow}
            disabled={adding}
            className="btn-primary text-base px-6 py-3"
          >
            <Play className="w-5 h-5" />
            {adding
              ? 'Открываем…'
              : existingCopy?.status === 'completed'
              ? 'Провести ещё раз'
              : 'Провести сейчас'}
          </button>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Время
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-base"
            />
          </div>
          <button onClick={handleAdd} disabled={adding} className="btn-secondary">
            <CopyPlus className="w-4 h-4" /> Запланировать
          </button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          «Провести сейчас» открывает пошаговый режим — ведите занятие прямо с телефона,
          отмечая выполненные упражнения (время засекайте на своём секундомере).
          «Запланировать» добавит занятие в ваши тренировки на выбранную дату.
        </p>
      </div>

      {/* Блоки */}
      <div className="space-y-4">
        {pw.blocks.map((b, bi) => (
          <div key={bi} className="card p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {bi + 1}. {PLAN_BLOCK_LABELS[b.type] ?? b.type}
                {b.mandatory && (
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 align-middle">
                    обязательно
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {b.duration_min} мин
              </span>
            </div>
            {(b.order || b.notes) && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {b.order ?? b.notes}
              </p>
            )}
            {b.exercise_ids && b.exercise_ids.length > 0 && (
              <div className="space-y-2 mt-2">
                {expandExerciseIds(b.exercise_ids).map((eid, ei) => {
                  const ex = planExerciseById[eid];
                  return ex ? (
                    <ExerciseCard
                      key={eid}
                      ex={ex}
                      progression={pw.progression}
                      index={ei + 1}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export default function PlanWorkoutPage() {
  return (
    <Suspense fallback={null}>
      <PlanWorkoutInner />
    </Suspense>
  );
}
