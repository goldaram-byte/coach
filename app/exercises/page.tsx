'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, Video, Clock } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STAGE_BADGE,
  STAGE_LABELS,
  plural,
} from '@/lib/labels';
import { CategoryId, StageId } from '@/lib/types';

const DIFF_BADGE: Record<string, string> = {
  beginner: 'badge-green',
  intermediate: 'badge-amber',
  advanced: 'badge-red',
};

export default function ExercisesPage() {
  const hydrated = useHydrated();
  const exercises = useAppStore((s) => s.exercises);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [stage, setStage] = useState<StageId | null>(null);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const filtered = exercises.filter((ex) => {
    const s = searchTerm.toLowerCase();
    return (
      (ex.name.toLowerCase().includes(s) || ex.description.toLowerCase().includes(s)) &&
      (!category || ex.category === category) &&
      (!stage || ex.stage === stage)
    );
  });

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="page-title">Библиотека упражнений</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {exercises.length} {plural(exercises.length, 'упражнение', 'упражнения', 'упражнений')}{' '}
            · используйте в любых программах и тренировках
          </p>
        </div>
        <Link href="/exercises/new" className="btn-primary no-underline">
          <Plus className="w-4 h-4" /> Добавить упражнение
        </Link>
      </div>

      {/* Search & filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск упражнений…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              !category
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Все
          </button>
          {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? null : c)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                category === c
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(STAGE_LABELS) as StageId[]).map((s) => (
            <button
              key={s}
              onClick={() => setStage(stage === s ? null : s)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                stage === s
                  ? 'bg-gradient-to-r from-ocean-600 to-ocean-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((ex) => (
          <Link
            key={ex.id}
            href={`/exercises/${ex.id}`}
            className="card-hover p-5 no-underline block"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{ex.name}</h3>
              {ex.custom && <span className="badge-orange shrink-0">Моё</span>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
              {ex.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge-blue">{CATEGORY_LABELS[ex.category]}</span>
              <span className={DIFF_BADGE[ex.difficulty]}>{DIFFICULTY_LABELS[ex.difficulty]}</span>
              <span className="badge-gray inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {ex.durationMin} мин
              </span>
              {ex.videos.length > 0 && (
                <span className="badge-gray inline-flex items-center gap-1">
                  <Video className="w-3 h-3" /> {ex.videos.length}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Упражнения не найдены</p>
          <Link href="/exercises/new" className="btn-primary no-underline">
            Создать упражнение
          </Link>
        </div>
      )}
    </PageShell>
  );
}
