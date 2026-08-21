'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, Link2, Trash2, ChevronUp, ChevronDown, Video } from 'lucide-react';
import { useAppStore, genId } from '@/store/appStore';
import { CATEGORY_LABELS, DIFFICULTY_LABELS, STAGE_LABELS } from '@/lib/labels';
import { CategoryId, Difficulty, Exercise, ExerciseVideo, StageId } from '@/lib/types';

export default function ExerciseForm({ existing }: { existing?: Exercise }) {
  const router = useRouter();
  const addExercise = useAppStore((s) => s.addExercise);
  const updateExercise = useAppStore((s) => s.updateExercise);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: existing?.name ?? '',
    category: (existing?.category ?? 'kumite') as CategoryId,
    stage: (existing?.stage ?? 'beginner') as StageId,
    difficulty: (existing?.difficulty ?? 'beginner') as Difficulty,
    goal: existing?.goal ?? '',
    description: existing?.description ?? '',
    equipment: existing?.equipment ?? '',
    durationMin: existing?.durationMin ?? 5,
    sets: existing?.sets,
    reps: existing?.reps,
    ageMin: existing?.ageMin,
    ageMax: existing?.ageMax,
    commonMistakes: existing?.commonMistakes ?? '',
    simplifiedVariant: existing?.simplifiedVariant ?? '',
    advancedVariant: existing?.advancedVariant ?? '',
  });
  const [videos, setVideos] = useState<ExerciseVideo[]>(existing?.videos ?? []);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const addVideoUrl = () => {
    const url = videoUrl.trim();
    if (!url) return;
    setVideos((vs) => [...vs, { id: genId('vid'), title: '', url }]);
    setVideoUrl('');
  };

  const addVideoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideos((vs) => [...vs, { id: genId('vid'), title: file.name, url }]);
  };

  const moveVideo = (id: string, dir: -1 | 1) =>
    setVideos((vs) => {
      const i = vs.findIndex((v) => v.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= vs.length) return vs;
      const copy = [...vs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const handleSave = () => {
    if (!form.name.trim()) return setError('Укажите название упражнения');
    if (!form.description.trim()) return setError('Добавьте описание');

    if (existing) {
      updateExercise(existing.id, { ...form, name: form.name.trim(), videos });
      router.push(`/exercise?id=${existing.id}`);
    } else {
      const ex: Exercise = {
        id: genId('ex'),
        ...form,
        name: form.name.trim(),
        videos,
        custom: true,
      };
      addExercise(ex);
      router.push(`/exercise?id=${ex.id}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="card p-5 sm:p-6">
        <h2 className="section-title mb-4">Основная информация</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-base">Название *</label>
            <input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Например: Контратака gyaku-zuki"
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Категория</label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value as CategoryId })}
              className="input-base"
            >
              {(Object.keys(CATEGORY_LABELS) as CategoryId[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-base">Этап подготовки</label>
            <select
              value={form.stage}
              onChange={(e) => set({ stage: e.target.value as StageId })}
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
            <label className="label-base">Уровень сложности</label>
            <select
              value={form.difficulty}
              onChange={(e) => set({ difficulty: e.target.value as Difficulty })}
              className="input-base"
            >
              {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Возраст от</label>
              <input
                type="number"
                min={4}
                value={form.ageMin ?? ''}
                onChange={(e) => set({ ageMin: e.target.value ? Number(e.target.value) : undefined })}
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Возраст до</label>
              <input
                type="number"
                min={4}
                value={form.ageMax ?? ''}
                onChange={(e) => set({ ageMax: e.target.value ? Number(e.target.value) : undefined })}
                className="input-base"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label-base">Цель упражнения</label>
            <input
              value={form.goal}
              onChange={(e) => set({ goal: e.target.value })}
              placeholder="Что развивает упражнение"
              className="input-base"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-base">Описание *</label>
            <textarea
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={4}
              placeholder="Как выполняется упражнение, на что обратить внимание"
              className="input-base"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-base">Инвентарь</label>
            <input
              value={form.equipment}
              onChange={(e) => set({ equipment: e.target.value })}
              placeholder="Лапы, макивара, координационная лестница…"
              className="input-base"
            />
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="section-title mb-4">Дозировка</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label-base">Время, мин</label>
            <input
              type="number"
              min={1}
              value={form.durationMin}
              onChange={(e) => set({ durationMin: Number(e.target.value) })}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Подходы</label>
            <input
              type="number"
              min={1}
              value={form.sets ?? ''}
              onChange={(e) => set({ sets: e.target.value ? Number(e.target.value) : undefined })}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Повторения</label>
            <input
              type="number"
              min={1}
              value={form.reps ?? ''}
              onChange={(e) => set({ reps: e.target.value ? Number(e.target.value) : undefined })}
              className="input-base"
            />
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="card p-5 sm:p-6">
        <h2 className="section-title mb-1 flex items-center gap-2">
          <Video className="w-5 h-5 text-brand-500" /> Видео
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Загрузите файл или добавьте ссылку. Первое видео показывается в режиме тренировки.
        </p>

        {videos.length > 0 && (
          <div className="space-y-2 mb-4">
            {videos.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60"
              >
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveVideo(v.id, -1)} disabled={i === 0} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveVideo(v.id, 1)} disabled={i === videos.length - 1} className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <video src={v.url} className="w-24 aspect-video rounded-lg bg-slate-950 object-cover shrink-0" />
                <input
                  value={v.title}
                  onChange={(e) =>
                    setVideos((vs) => vs.map((x) => (x.id === v.id ? { ...x, title: e.target.value } : x)))
                  }
                  placeholder="Название видео"
                  className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none border-b border-transparent focus:border-brand-400"
                />
                <button
                  onClick={() => setVideos((vs) => vs.filter((x) => x.id !== v.id))}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
            <Upload className="w-4 h-4" /> Загрузить файл
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) addVideoFile(f);
              e.target.value = '';
            }}
          />
          <div className="flex flex-1 min-w-[220px] gap-2">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="…или вставьте ссылку на видео"
              className="input-base !py-2"
            />
            <button onClick={addVideoUrl} className="btn-blue !py-2">
              <Link2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          В демо-режиме загруженные файлы доступны до перезагрузки страницы. С подключённым
          Supabase Storage видео сохраняются навсегда.
        </p>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="section-title mb-4">Методика</h2>
        <div className="space-y-4">
          <div>
            <label className="label-base">Распространённые ошибки</label>
            <textarea
              value={form.commonMistakes}
              onChange={(e) => set({ commonMistakes: e.target.value })}
              rows={2}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Упрощённый вариант</label>
            <textarea
              value={form.simplifiedVariant}
              onChange={(e) => set({ simplifiedVariant: e.target.value })}
              rows={2}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Усложнённый вариант</label>
            <textarea
              value={form.advancedVariant}
              onChange={(e) => set({ advancedVariant: e.target.value })}
              rows={2}
              className="input-base"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <button onClick={handleSave} className="btn-primary w-full sm:w-auto text-base py-3">
        <Save className="w-5 h-5" /> {existing ? 'Сохранить изменения' : 'Создать упражнение'}
      </button>
    </div>
  );
}
