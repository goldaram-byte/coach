'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Search,
  ChevronUp,
  ChevronDown,
  Layers,
  Crown,
  Clock,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore, genId } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/lib/useHydrated';
import { CATEGORY_LABELS, STAGE_BADGE, STAGE_LABELS, plural } from '@/lib/labels';
import { BlockTemplate, CategoryId, StageId, TemplateExercise } from '@/lib/types';

export default function BlocksPage() {
  const hydrated = useHydrated();

  const sharedBlocks = useAppStore((s) => s.sharedBlocks);
  const blockTemplates = useAppStore((s) => s.blockTemplates);
  const hiddenIds = useAppStore((s) => s.hiddenSharedBlockIds);
  const exercises = useAppStore((s) => s.exercises);

  const addSharedBlock = useAppStore((s) => s.addSharedBlock);
  const updateSharedBlock = useAppStore((s) => s.updateSharedBlock);
  const deleteSharedBlock = useAppStore((s) => s.deleteSharedBlock);
  const addBlockTemplate = useAppStore((s) => s.addBlockTemplate);
  const updateBlockTemplate = useAppStore((s) => s.updateBlockTemplate);
  const deleteBlockTemplate = useAppStore((s) => s.deleteBlockTemplate);
  const toggleHidden = useAppStore((s) => s.toggleHiddenSharedBlock);

  const authStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isOwner = authStatus === 'offline' || !!user?.isAdmin;

  const [stageFilter, setStageFilter] = useState<StageId | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  // ---- editor state ----
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingShared, setEditingShared] = useState(false);
  const [name, setName] = useState('');
  const [stage, setStage] = useState<StageId>('beginner');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<TemplateExercise[]>([]);
  const [error, setError] = useState('');

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<CategoryId | null>(null);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const hidden = new Set(hiddenIds);
  const byStage = (b: BlockTemplate) => !stageFilter || b.stage === stageFilter;

  const visibleShared = sharedBlocks.filter((b) => byStage(b) && !hidden.has(b.id));
  const hiddenShared = sharedBlocks.filter((b) => byStage(b) && hidden.has(b.id));
  const own = blockTemplates.filter(byStage);

  // ---- editor helpers ----
  const openCreate = (shared: boolean) => {
    setEditingId(null);
    setEditingShared(shared);
    setName('');
    setStage(stageFilter ?? 'beginner');
    setDescription('');
    setItems([]);
    setError('');
    setEditorOpen(true);
  };

  const openEdit = (b: BlockTemplate, shared: boolean) => {
    setEditingId(b.id);
    setEditingShared(shared);
    setName(b.name);
    setStage(b.stage);
    setDescription(b.description ?? '');
    setItems(b.exercises.map((te) => ({ ...te })));
    setError('');
    setEditorOpen(true);
  };

  const moveItem = (id: string, dir: -1 | 1) =>
    setItems((list) => {
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const totalMin = items.reduce((s, te) => s + (te.durationMin ?? 0), 0);

  const handleSave = () => {
    if (!name.trim()) return setError('Укажите название блока');
    if (items.length === 0) return setError('Добавьте хотя бы одно упражнение');

    const block: BlockTemplate = {
      id: editingId ?? genId('blk'),
      name: name.trim(),
      stage,
      description: description.trim() || undefined,
      durationMin: totalMin,
      exercises: items,
    };

    if (editingShared) {
      editingId ? updateSharedBlock(block.id, block) : addSharedBlock(block);
    } else {
      editingId ? updateBlockTemplate(block.id, block) : addBlockTemplate(block);
    }
    setEditorOpen(false);
  };

  const pickerList = exercises.filter((e) => {
    const s = pickerSearch.toLowerCase();
    return (
      e.name.toLowerCase().includes(s) &&
      (!pickerCategory || e.category === pickerCategory)
    );
  });

  // ---- card ----
  const BlockCard = ({
    b,
    shared,
    isHidden,
  }: {
    b: BlockTemplate;
    shared: boolean;
    isHidden?: boolean;
  }) => (
    <div className={`card p-5 ${isHidden ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={STAGE_BADGE[b.stage]}>{STAGE_LABELS[b.stage]}</span>
            {shared && (
              <span className="badge-orange inline-flex items-center gap-1">
                <Crown className="w-3 h-3" /> Базовый
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">{b.name}</h3>
          {b.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{b.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {shared && !isOwner && (
            <button
              onClick={() => toggleHidden(b.id)}
              title={isHidden ? 'Показать блок' : 'Скрыть блок'}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
          {(shared ? isOwner : true) && (
            <>
              <button
                onClick={() => openEdit(b, shared)}
                title="Редактировать"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Удалить блок «${b.name}»?`))
                    shared ? deleteSharedBlock(b.id) : deleteBlockTemplate(b.id);
                }}
                title="Удалить"
                className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4" /> {b.durationMin} мин
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="w-4 h-4" /> {b.exercises.length}{' '}
          {plural(b.exercises.length, 'упражнение', 'упражнения', 'упражнений')}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2 line-clamp-1">
        {b.exercises.map((te) => te.exercise.name).join(' · ')}
      </p>
    </div>
  );

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <h1 className="page-title">Блоки тренировок</h1>
        <div className="flex gap-2">
          {isOwner && (
            <button onClick={() => openCreate(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Базовый блок
            </button>
          )}
          <button
            onClick={() => openCreate(false)}
            className={isOwner ? 'btn-secondary' : 'btn-primary'}
          >
            <Plus className="w-4 h-4" /> Свой блок
          </button>
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        {isOwner
          ? 'Базовые блоки видят все тренеры. Собирайте их по этапам подготовки.'
          : 'Базовые блоки составлены владельцем. Скрывайте ненужные и создавайте свои.'}
      </p>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStageFilter(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            !stageFilter
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          Все этапы
        </button>
        {(Object.keys(STAGE_LABELS) as StageId[]).map((s) => (
          <button
            key={s}
            onClick={() => setStageFilter(stageFilter === s ? null : s)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              stageFilter === s
                ? 'bg-gradient-to-r from-ocean-600 to-ocean-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Base blocks */}
      <h2 className="section-title mb-3 flex items-center gap-2">
        <Crown className="w-5 h-5 text-brand-500" /> Базовые блоки
      </h2>
      {visibleShared.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {visibleShared.map((b) => (
            <BlockCard key={b.id} b={b} shared />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center mb-4">
          <p className="text-slate-500 dark:text-slate-400">
            {hiddenShared.length > 0
              ? 'Все базовые блоки этого этапа скрыты.'
              : isOwner
              ? 'Базовых блоков для этого этапа пока нет — создайте первый.'
              : 'Владелец ещё не добавил базовые блоки для этого этапа.'}
          </p>
        </div>
      )}

      {!isOwner && hiddenShared.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
          >
            <EyeOff className="w-4 h-4" />
            Скрытые блоки ({hiddenShared.length}) {showHidden ? '— свернуть' : '— показать'}
          </button>
          {showHidden && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {hiddenShared.map((b) => (
                <BlockCard key={b.id} b={b} shared isHidden />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Own blocks */}
      <h2 className="section-title mb-3 mt-8">Мои блоки</h2>
      {own.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {own.map((b) => (
            <BlockCard key={b.id} b={b} shared={false} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Своих блоков пока нет
          </p>
          <button onClick={() => openCreate(false)} className="btn-outline">
            <Plus className="w-4 h-4" /> Создать блок
          </button>
        </div>
      )}

      {/* ---------- Editor modal ---------- */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingId ? 'Редактирование блока' : editingShared ? 'Новый базовый блок' : 'Новый блок'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="label-base">Название *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Разминка перед кумитэ"
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-base">Этап подготовки</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StageId)}
                  className="input-base"
                >
                  {(Object.keys(STAGE_LABELS) as StageId[]).map((s) => (
                    <option key={s} value={s}>
                      {STAGE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base">Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Для чего этот блок"
                  className="input-base"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-base !mb-0">Упражнения *</label>
                  <span className="badge-blue tabular-nums">{totalMin} мин</span>
                </div>
                <div className="space-y-2">
                  {items.map((te, i) => (
                    <div
                      key={te.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                    >
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveItem(te.id, -1)} disabled={i === 0} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveItem(te.id, 1)} disabled={i === items.length - 1} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                          {te.exercise.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {CATEGORY_LABELS[te.exercise.category]}
                          {te.sets && te.reps ? ` · ${te.sets}×${te.reps}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          value={te.durationMin ?? ''}
                          onChange={(e) =>
                            setItems((list) =>
                              list.map((x) =>
                                x.id === te.id
                                  ? { ...x, durationMin: e.target.value ? Number(e.target.value) : undefined }
                                  : x
                              )
                            )
                          }
                          className="w-14 px-2 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center tabular-nums"
                        />
                        <span className="text-xs text-slate-400">мин</span>
                      </div>
                      <button
                        onClick={() => setItems((list) => list.filter((x) => x.id !== te.id))}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setPickerOpen(true);
                    setPickerSearch('');
                    setPickerCategory(null);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-sm font-semibold text-ocean-600 dark:text-ocean-400 hover:border-ocean-400 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Добавить упражнение
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleSave} className="btn-primary w-full">
                <Save className="w-4 h-4" />
                {editingShared ? 'Сохранить базовый блок' : 'Сохранить блок'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Exercise picker ---------- */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Выбор упражнения</h3>
                <button onClick={() => setPickerOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
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
                    !pickerCategory
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Все
                </button>
                {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setPickerCategory(pickerCategory === c ? null : c)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      pickerCategory === c
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                    setItems((list) => [
                      ...list,
                      {
                        id: genId('te'),
                        exercise: ex,
                        durationMin: ex.durationMin,
                        sets: ex.sets,
                        reps: ex.reps,
                      },
                    ]);
                    setPickerOpen(false);
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
