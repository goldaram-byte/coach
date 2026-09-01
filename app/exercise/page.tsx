'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Clock,
  Repeat,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Pencil,
  Trash2,
  Dumbbell,
  Target,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STAGE_BADGE,
  STAGE_LABELS,
} from '@/lib/labels';

function ExerciseDetailInner() {
  const exerciseId = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const hydrated = useHydrated();
  const exercises = useAppStore((s) => s.exercises);
  const deleteExercise = useAppStore((s) => s.deleteExercise);

  const ex = exercises.find((e) => e.id === exerciseId);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  if (!ex)
    return (
      <PageShell>
        <p className="text-slate-500">Упражнение не найдено.</p>
        <Link href="/exercises" className="btn-secondary mt-4 no-underline">
          ← К библиотеке
        </Link>
      </PageShell>
    );

  const handleDelete = () => {
    if (confirm('Удалить упражнение из библиотеки?')) {
      deleteExercise(ex.id);
      router.push('/exercises');
    }
  };

  return (
    <PageShell>
      <Link href="/exercises" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ChevronLeft className="w-4 h-4" /> Библиотека
      </Link>

      <div className="card p-5 sm:p-7 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-ocean-600" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="badge-blue">{CATEGORY_LABELS[ex.category]}</span>
              <span className={STAGE_BADGE[ex.stage]}>{STAGE_LABELS[ex.stage]}</span>
              <span className="badge-orange">{DIFFICULTY_LABELS[ex.difficulty]}</span>
              {ex.custom && <span className="badge-gray">Создано мной</span>}
            </div>
            <h1 className="page-title">{ex.name}</h1>
            {(ex.ageMin || ex.ageMax) && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Возраст: {ex.ageMin ?? '—'}–{ex.ageMax ?? '…'} лет
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/exercise-edit?id=${ex.id}`} className="btn-secondary no-underline">
              <Pencil className="w-4 h-4" /> Изменить
            </Link>
            <button onClick={handleDelete} className="btn-secondary text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <Clock className="w-5 h-5 text-ocean-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 dark:text-white tabular-nums">{ex.durationMin} мин</p>
            <p className="text-xs text-slate-400">время</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <Repeat className="w-5 h-5 text-brand-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 dark:text-white tabular-nums">
              {ex.sets ?? '—'}
            </p>
            <p className="text-xs text-slate-400">подходы</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <Dumbbell className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 dark:text-white tabular-nums">
              {ex.reps ?? '—'}
            </p>
            <p className="text-xs text-slate-400">повторения</p>
          </div>
        </div>
      </div>

      {/* Goal & description */}
      <div className="card p-5 sm:p-6 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-400 mb-1.5 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> Цель упражнения
        </p>
        <p className="text-slate-800 dark:text-slate-100 font-medium mb-4">{ex.goal}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
          Описание
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ex.description}</p>
        {ex.equipment && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mt-4 mb-1.5">
              Инвентарь
            </p>
            <p className="text-slate-600 dark:text-slate-300">{ex.equipment}</p>
          </>
        )}
      </div>

      {/* Videos */}
      {ex.videos.length > 0 && (
        <div className="card p-5 sm:p-6 mb-5">
          <h2 className="section-title mb-4">Видео ({ex.videos.length})</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ex.videos.map((v) => (
              <div key={v.id} className="rounded-xl overflow-hidden bg-slate-950">
                <video src={v.url} controls className="w-full aspect-video" />
                {v.title && (
                  <p className="px-3 py-2 text-sm text-slate-300">{v.title}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mistakes & variants */}
      <div className="grid sm:grid-cols-1 gap-4">
        {ex.commonMistakes && (
          <div className="card p-5 border-l-4 !border-l-red-400">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Распространённые ошибки
            </p>
            <p className="text-slate-600 dark:text-slate-300">{ex.commonMistakes}</p>
          </div>
        )}
        {ex.simplifiedVariant && (
          <div className="card p-5 border-l-4 !border-l-emerald-400">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5 flex items-center gap-1.5">
              <ArrowDownCircle className="w-3.5 h-3.5" /> Упрощённый вариант
            </p>
            <p className="text-slate-600 dark:text-slate-300">{ex.simplifiedVariant}</p>
          </div>
        )}
        {ex.advancedVariant && (
          <div className="card p-5 border-l-4 !border-l-brand-400">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-1.5 flex items-center gap-1.5">
              <ArrowUpCircle className="w-3.5 h-3.5" /> Усложнённый вариант
            </p>
            <p className="text-slate-600 dark:text-slate-300">{ex.advancedVariant}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default function ExerciseDetailPage() {
  return (
    <Suspense fallback={null}>
      <ExerciseDetailInner />
    </Suspense>
  );
}
