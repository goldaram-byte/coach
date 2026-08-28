'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  ChevronLeft,
  Check,
  Clock,
  Video,
  SkipForward,
  Flag,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import AuthGate from '@/components/common/AuthGate';

interface FlatItem {
  blockIndex: number;
  blockName: string;
  blockDuration: number;
  weId: string;
  exerciseId: string;
  durationMin?: number;
  sets?: number;
  reps?: number;
  notes?: string;
}

function WorkoutRunInner() {
  const workoutId = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const hydrated = useHydrated();

  const workouts = useAppStore((s) => s.workouts);
  const exercises = useAppStore((s) => s.exercises);
  const toggleExerciseDone = useAppStore((s) => s.toggleExerciseDone);
  const completeWorkout = useAppStore((s) => s.completeWorkout);

  const workout = workouts.find((w) => w.id === workoutId);

  const flat: FlatItem[] = useMemo(() => {
    if (!workout) return [];
    return workout.blocks.flatMap((b, bi) =>
      b.exercises.map((we) => ({
        blockIndex: bi,
        blockName: b.name,
        blockDuration: b.durationMin,
        weId: we.id,
        exerciseId: we.exerciseId,
        durationMin: we.durationMin,
        sets: we.sets,
        reps: we.reps,
        notes: we.notes,
      }))
    );
  }, [workout]);

  const [index, setIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [finished, setFinished] = useState(false);
  const [note, setNote] = useState('');

  const current = flat[index];
  const exercise = current ? exercises.find((e) => e.id === current.exerciseId) : undefined;

  // Скрыть видео при смене упражнения
  useEffect(() => {
    setShowVideo(false);
  }, [index]);

  if (!hydrated) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!workout || flat.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white p-6">
        <p>Тренировка не найдена или пуста.</p>
        <Link href="/workouts" className="btn-secondary no-underline">
          К тренировкам
        </Link>
      </div>
    );
  }

  const done = new Set(workout.completedExerciseIds ?? []);
  const doneCount = flat.filter((f) => done.has(f.weId)).length;
  const totalBlocks = workout.blocks.length;

  const goNext = () => {
    if (index < flat.length - 1) setIndex(index + 1);
    else setFinished(true);
  };
  const goPrev = () => index > 0 && setIndex(index - 1);

  const markDoneAndNext = () => {
    if (!done.has(current.weId)) toggleExerciseDone(workout.id, current.weId);
    goNext();
  };

  const handleFinish = () => {
    completeWorkout(workout.id, note.trim());
    router.push(`/workout?id=${workout.id}`);
  };

  // ============ FINISH SCREEN ============
  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-900 via-slate-950 to-slate-950 text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-glow">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-extrabold text-center">Тренировка выполнена!</h1>
          <p className="text-ocean-200 mt-2 text-center">
            {workout.theme} · выполнено {doneCount} из {flat.length} упражнений
          </p>

          <div className="w-full mt-8">
            <label className="block text-sm font-medium text-ocean-200 mb-2">
              Заметка о тренировке: что получилось, что изменить в следующий раз
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Например: группа хорошо освоила контратаку, в следующий раз добавить работу на скорость…"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-ocean-300/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex gap-3 w-full mt-6">
            <button onClick={() => setFinished(false)} className="btn-secondary flex-1">
              Назад
            </button>
            <button onClick={handleFinish} className="btn-primary flex-1">
              <Flag className="w-4 h-4" /> Завершить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN RUN SCREEN ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-ocean-950 to-slate-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link
          href={`/workout?id=${workout.id}`}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors no-underline"
        >
          <X className="w-5 h-5 text-white" />
        </Link>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-ocean-300 font-semibold">
            Тренировка
          </p>
          <p className="font-bold text-sm mt-0.5">
            Блок {current.blockIndex + 1} из {totalBlocks}
          </p>
        </div>
        <button
          onClick={() => setFinished(true)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          title="Завершить тренировку"
        >
          <Flag className="w-5 h-5 text-brand-400" />
        </button>
      </div>

      {/* Overall progress */}
      <div className="px-4 sm:px-6">
        <div className="flex gap-1">
          {flat.map((f, i) => (
            <div
              key={f.weId}
              className={`h-1 flex-1 rounded-full transition-colors ${
                done.has(f.weId)
                  ? 'bg-emerald-400'
                  : i === index
                  ? 'bg-brand-500'
                  : i < index
                  ? 'bg-ocean-500'
                  : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full">
        <span className="badge bg-brand-500/20 text-brand-300 uppercase tracking-widest text-[11px]">
          {current.blockName}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mt-4">
          {exercise?.name ?? 'Упражнение'}
        </h1>

        {(current.sets || current.reps) && (
          <p className="text-ocean-200 mt-2 font-semibold">
            {current.sets && `${current.sets} подходов`}
            {current.sets && current.reps && ' × '}
            {current.reps && `${current.reps} повторений`}
          </p>
        )}

        {/* Рекомендуемое время + видео (тренер засекает на своём секундомере) */}
        <div className="flex items-center gap-3 mt-6 mb-6">
          {current.durationMin && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-ocean-100 font-semibold">
              <Clock className="w-4 h-4 text-brand-400" /> ~{current.durationMin} мин
            </span>
          )}
          {exercise && exercise.videos.length > 0 && (
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-ocean-600/60 hover:bg-ocean-600 transition-colors font-semibold"
            >
              <Video className="w-4 h-4" /> Видео
            </button>
          )}
        </div>

        {/* Instruction */}
        {exercise && (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ocean-300 mb-1.5">
              Инструкция
            </p>
            <p className="text-sm text-ocean-100 leading-relaxed">{exercise.description}</p>
            {current.notes && (
              <p className="text-sm text-brand-300 mt-2 font-medium">💡 {current.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-4 sm:px-6 pb-6 pt-2 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-[auto_1fr_auto] gap-3">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={markDoneAndNext} className="btn-primary text-base py-3.5">
            <Check className="w-5 h-5" />
            {index === flat.length - 1 ? 'Выполнено · Завершить' : 'Выполнено · Дальше'}
          </button>
          <button
            onClick={goNext}
            className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20"
            title="Пропустить"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-ocean-300/70 mt-3">
          Упражнение {index + 1} из {flat.length} · выполнено {doneCount}
        </p>
      </div>

      {/* Video modal */}
      {showVideo && exercise && exercise.videos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl overflow-hidden max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="font-bold">{exercise.videos[0].title || exercise.name}</p>
              <button onClick={() => setShowVideo(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <video src={exercise.videos[0].url} controls autoPlay className="w-full aspect-video bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutRunPage() {
  return (
    <AuthGate>
      <Suspense fallback={null}>
        <WorkoutRunInner />
      </Suspense>
    </AuthGate>
  );
}
