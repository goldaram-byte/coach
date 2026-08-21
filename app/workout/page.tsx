'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Play,
  Clock,
  Users,
  Copy,
  Trash2,
  Video,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { STAGE_BADGE, STAGE_LABELS, formatDateFullRu } from '@/lib/labels';
import { todayISO } from '@/lib/seed';

function WorkoutDetailInner() {
  const workoutId = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);
  const exercises = useAppStore((s) => s.exercises);
  const groups = useAppStore((s) => s.groups);
  const duplicateWorkout = useAppStore((s) => s.duplicateWorkout);
  const deleteWorkout = useAppStore((s) => s.deleteWorkout);

  const workout = workouts.find((w) => w.id === workoutId);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  if (!workout)
    return (
      <PageShell>
        <p className="text-slate-500">Тренировка не найдена.</p>
        <Link href="/workouts" className="btn-secondary mt-4 no-underline">
          ← К тренировкам
        </Link>
      </PageShell>
    );

  const group = groups.find((g) => g.id === workout.groupId);
  const done = new Set(workout.completedExerciseIds ?? []);

  const handleDuplicate = () => {
    const newId = duplicateWorkout(workout.id, todayISO());
    if (newId) router.push(`/workout?id=${newId}`);
  };

  const handleDelete = () => {
    if (confirm('Удалить тренировку?')) {
      deleteWorkout(workout.id);
      router.push('/workouts');
    }
  };

  return (
    <PageShell>
      <Link href="/workouts" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ChevronLeft className="w-4 h-4" /> Тренировки
      </Link>

      {/* Header card */}
      <div className="card p-5 sm:p-7 mb-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ocean-600 via-ocean-500 to-brand-500" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={STAGE_BADGE[workout.stage]}>{STAGE_LABELS[workout.stage]}</span>
              {workout.status === 'completed' && (
                <span className="badge-green inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Выполнена
                </span>
              )}
            </div>
            <h1 className="page-title">{workout.theme}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">
              {formatDateFullRu(workout.date)} · {workout.time}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-300 flex-wrap">
              {group && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-ocean-500" /> {group.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-ocean-500" /> {workout.durationMin} минут
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {workout.status === 'planned' && (
              <Link href={`/run?id=${workout.id}`} className="btn-primary no-underline">
                <Play className="w-4 h-4" /> Начать тренировку
              </Link>
            )}
            <button onClick={handleDuplicate} className="btn-secondary" title="Скопировать на сегодня">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="btn-secondary text-red-500" title="Удалить">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-ocean-50 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-400 mb-1">
            Цель тренировки
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{workout.goal}</p>
        </div>

        {workout.completedNote && (
          <div className="mt-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Заметка тренера
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{workout.completedNote}</p>
          </div>
        )}
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {workout.blocks.map((block, bi) => (
          <div key={block.id} className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {bi + 1}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white">{block.name}</h3>
              </div>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {block.durationMin} мин
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {block.exercises.map((we) => {
                const ex = exercises.find((e) => e.id === we.exerciseId);
                if (!ex) return null;
                const isDone = done.has(we.id);
                return (
                  <div key={we.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/exercise?id=${ex.id}`}
                          className={`font-semibold no-underline hover:text-brand-600 ${
                            isDone
                              ? 'text-slate-400 line-through'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {ex.name}
                        </Link>
                        {ex.videos.length > 0 && (
                          <span className="badge-blue inline-flex items-center gap-1">
                            <Video className="w-3 h-3" /> {ex.videos.length}
                          </span>
                        )}
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {ex.description}
                      </p>
                      {we.notes && (
                        <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
                          💡 {we.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                      {we.durationMin && <div className="font-semibold">{we.durationMin} мин</div>}
                      {we.sets && we.reps && (
                        <div className="text-xs mt-0.5">
                          {we.sets}×{we.reps}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export default function WorkoutDetailPage() {
  return (
    <Suspense fallback={null}>
      <WorkoutDetailInner />
    </Suspense>
  );
}
