'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Search,
  Save,
  Layers,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore, genId } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { todayISO } from '@/lib/seed';
import { CATEGORY_LABELS, STAGE_LABELS } from '@/lib/labels';
import { CategoryId, StageId, Workout, WorkoutBlock } from '@/lib/types';

const DEFAULT_BLOCKS = ['Разминка', 'Работа ног', 'Техническая подготовка', 'Работа в парах', 'СФП', 'Заминка'];

function BuilderInner() {
  const router = useRouter();
  const search = useSearchParams();
  const hydrated = useHydrated();

  const groups = useAppStore((s) => s.groups);
  const exercises = useAppStore((s) => s.exercises);
  const addWorkout = useAppStore((s) => s.addWorkout);

  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState(search.get('date') ?? todayISO());
  const [time, setTime] = useState('16:00');
  const [theme, setTheme] = useState(search.get('theme') ?? '');
  const [goal, setGoal] = useState('');
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([
    { id: genId('blk'), name: 'Разминка', durationMin: 15, exercises: [] },
  ]);
  const [pickerBlockId, setPickerBlockId] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<CategoryId | null>(null);
  const [error, setError] = useState('');

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const selectedGroup = groups.find((g) => g.id === groupId);
  const stage: StageId = selectedGroup?.stage ?? ((search.get('stage') as StageId) || 'beginner');
  const totalMin = blocks.reduce((s, b) => s + b.durationMin, 0);

  // ----- block ops -----
  const addBlock = (name?: string) =>
    setBlocks((bs) => [
      ...bs,
      { id: genId('blk'), name: name ?? 'Новый блок', durationMin: 10, exercises: [] },
    ]);

  const updateBlock = (id: string, patch: Partial<WorkoutBlock>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const removeBlock = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));

  const moveBlock = (id: string, dir: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const copy = [...bs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  // ----- exercise ops -----
  const addExerciseToBlock = (blockId: string, exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === blockId
          ? {
              ...b,
              exercises: [
                ...b.exercises,
                {
                  id: genId('we'),
                  exerciseId,
                  durationMin: ex?.durationMin,
                  sets: ex?.sets,
                  reps: ex?.reps,
                },
              ],
            }
          : b
      )
    );
  };

  const removeExercise = (blockId: string, weId: string) =>
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === blockId ? { ...b, exercises: b.exercises.filter((e) => e.id !== weId) } : b
      )
    );

  const moveExercise = (blockId: string, weId: string, dir: -1 | 1) =>
    setBlocks((bs) =>
      bs.map((b) => {
        if (b.id !== blockId) return b;
        const i = b.exercises.findIndex((e) => e.id === weId);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= b.exercises.length) return b;
        const copy = [...b.exercises];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return { ...b, exercises: copy };
      })
    );

  // ----- save -----
  const handleSave = () => {
    if (!theme.trim()) return setError('Укажите тему тренировки');
    if (!groupId) return setError('Выберите группу');
    if (blocks.every((b) => b.exercises.length === 0))
      return setError('Добавьте хотя бы одно упражнение');

    const workout: Workout = {
      id: genId('wk'),
      name: theme.trim(),
      theme: theme.trim(),
      goal: goal.trim() || theme.trim(),
      date,
      time,
      groupId,
      stage,
      durationMin: totalMin,
      status: 'planned',
      blocks: blocks.filter((b) => b.exercises.length > 0 || b.name.trim()),
    };
    addWorkout(workout);
    router.push(`/workouts/${workout.id}`);
  };

  const pickerList = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesCat = !pickerCategory || e.category === pickerCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="page-title">Конструктор тренировок</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Соберите тренировку из блоков и упражнений библиотеки
        </p>
      </div>

      {/* Basic info */}
      <div className="card p-5 sm:p-6 mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-base">Группа *</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="input-base"
            >
              <option value="">Выберите группу…</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} · {STAGE_LABELS[g.stage]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Дата</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Время</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-base"
              />
            </div>
          </div>
          <div>
            <label className="label-base">Тема тренировки *</label>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Например: Атака первым номером"
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Цель тренировки</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Например: развитие навыка своевременной атаки"
              className="input-base"
            />
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" /> Тренировочные блоки
        </h2>
        <span className="badge-blue tabular-nums">{totalMin} мин всего</span>
      </div>

      <div className="space-y-4 mb-5">
        {blocks.map((block, bi) => (
          <div key={block.id} className="card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex-wrap">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {bi + 1}
              </span>
              <input
                value={block.name}
                onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                className="flex-1 min-w-[140px] bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-brand-400"
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  value={block.durationMin}
                  onChange={(e) => updateBlock(block.id, { durationMin: Number(e.target.value) })}
                  className="w-16 px-2 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center tabular-nums"
                />
                <span className="text-xs text-slate-400">мин</span>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => moveBlock(block.id, -1)} disabled={bi === 0} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveBlock(block.id, 1)} disabled={bi === blocks.length - 1} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeBlock(block.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {block.exercises.map((we, ei) => {
                const ex = exercises.find((e) => e.id === we.exerciseId);
                return (
                  <div key={we.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveExercise(block.id, we.id, -1)} disabled={ei === 0} className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveExercise(block.id, we.id, 1)} disabled={ei === block.exercises.length - 1} className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
                        {ex?.name ?? '—'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {ex && CATEGORY_LABELS[ex.category]}
                        {we.durationMin ? ` · ${we.durationMin} мин` : ''}
                        {we.sets && we.reps ? ` · ${we.sets}×${we.reps}` : ''}
                      </p>
                    </div>
                    <button onClick={() => removeExercise(block.id, we.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setPickerBlockId(block.id);
                  setPickerSearch('');
                  setPickerCategory(null);
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Добавить упражнение
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add block */}
      <div className="card p-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Добавить блок
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_BLOCKS.map((name) => (
            <button key={name} onClick={() => addBlock(name)} className="btn-secondary text-sm py-1.5">
              + {name}
            </button>
          ))}
          <button onClick={() => addBlock()} className="btn-outline text-sm py-1.5">
            + Свой блок
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <button onClick={handleSave} className="btn-primary w-full sm:w-auto text-base py-3">
        <Save className="w-5 h-5" /> Сохранить тренировку
      </button>

      {/* Exercise picker modal */}
      {pickerBlockId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setPickerBlockId(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Выбор упражнения</h3>
                <button onClick={() => setPickerBlockId(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Поиск…"
                  className="input-base !py-2 pl-9"
                  autoFocus
                />
              </div>
              <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
                <button
                  onClick={() => setPickerCategory(null)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    !pickerCategory ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Все
                </button>
                {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setPickerCategory(pickerCategory === c ? null : c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      pickerCategory === c ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {pickerList.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    addExerciseToBlock(pickerBlockId, ex.id);
                    setPickerBlockId(null);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">{ex.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {CATEGORY_LABELS[ex.category]} · {ex.durationMin} мин
                    {ex.sets && ex.reps ? ` · ${ex.sets}×${ex.reps}` : ''}
                  </p>
                </button>
              ))}
              {pickerList.length === 0 && (
                <p className="p-6 text-center text-sm text-slate-400">Ничего не найдено</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderInner />
    </Suspense>
  );
}
