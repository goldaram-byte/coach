'use client';

import Link from 'next/link';
import { Clock, Layers, Play, CheckCircle2, Users } from 'lucide-react';
import { Workout } from '@/lib/types';
import { STAGE_BADGE, STAGE_LABELS, formatDateRu } from '@/lib/labels';
import { useAppStore } from '@/store/appStore';

export default function WorkoutCard({
  workout,
  showDate = false,
}: {
  workout: Workout;
  showDate?: boolean;
}) {
  const groups = useAppStore((s) => s.groups);
  const group = groups.find((g) => g.id === workout.groupId);
  const exercisesCount = workout.blocks.reduce((n, b) => n + b.exercises.length, 0);

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <span className="text-2xl font-extrabold text-ocean-700 dark:text-ocean-400 tabular-nums">
              {workout.time}
            </span>
            {showDate && (
              <span className="badge-gray">{formatDateRu(workout.date)}</span>
            )}
            <span className={STAGE_BADGE[workout.stage]}>{STAGE_LABELS[workout.stage]}</span>
            {workout.status === 'completed' && (
              <span className="badge-green inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Выполнена
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {workout.theme}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{workout.goal}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            {group && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {group.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {workout.durationMin} мин
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> {workout.blocks.length} блоков · {exercisesCount} упр.
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {workout.status === 'planned' ? (
            <>
              <Link href={`/workout?id=${workout.id}`} className="btn-secondary flex-1 sm:flex-none no-underline">
                Открыть
              </Link>
              <Link href={`/run?id=${workout.id}`} className="btn-primary flex-1 sm:flex-none no-underline">
                <Play className="w-4 h-4" /> Начать
              </Link>
            </>
          ) : (
            <Link href={`/workout?id=${workout.id}`} className="btn-secondary flex-1 sm:flex-none no-underline">
              Открыть
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
