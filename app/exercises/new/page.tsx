'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { useHydrated } from '@/lib/useHydrated';

export default function NewExercisePage() {
  const hydrated = useHydrated();

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  return (
    <PageShell>
      <Link href="/exercises" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ChevronLeft className="w-4 h-4" /> Библиотека
      </Link>
      <h1 className="page-title mb-6">Новое упражнение</h1>
      <ExerciseForm />
    </PageShell>
  );
}
