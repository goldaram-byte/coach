'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';

export default function EditExercisePage() {
  const params = useParams<{ exerciseId: string }>();
  const hydrated = useHydrated();
  const exercises = useAppStore((s) => s.exercises);
  const ex = exercises.find((e) => e.id === params.exerciseId);

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

  return (
    <PageShell>
      <Link href={`/exercises/${ex.id}`} className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ChevronLeft className="w-4 h-4" /> {ex.name}
      </Link>
      <h1 className="page-title mb-6">Редактирование упражнения</h1>
      <ExerciseForm existing={ex} />
    </PageShell>
  );
}
