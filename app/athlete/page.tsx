'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ChevronLeft, Plus, Trash2, Target, Trophy, X } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { calcAge, formatDateRu, SKILL_LABELS } from '@/lib/labels';
import { AthleteSkills } from '@/lib/types';

function AthleteDetailInner() {
  const athleteId = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const hydrated = useHydrated();
  const athletes = useAppStore((s) => s.athletes);
  const groups = useAppStore((s) => s.groups);
  const competitions = useAppStore((s) => s.competitions);
  const updateAthlete = useAppStore((s) => s.updateAthlete);
  const deleteAthlete = useAppStore((s) => s.deleteAthlete);

  const [newGoal, setNewGoal] = useState('');

  const athlete = athletes.find((a) => a.id === athleteId);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  if (!athlete)
    return (
      <PageShell>
        <p className="text-slate-500">Спортсмен не найден.</p>
        <Link href="/athletes" className="btn-secondary mt-4 no-underline">
          ← К спортсменам
        </Link>
      </PageShell>
    );

  const group = groups.find((g) => g.id === athlete.groupId);
  const athleteComps = competitions.filter((c) => c.athleteIds.includes(athlete.id));

  const setSkill = (key: keyof AthleteSkills, value: number) =>
    updateAthlete(athlete.id, { skills: { ...athlete.skills, [key]: value } });

  const addGoal = () => {
    if (!newGoal.trim()) return;
    updateAthlete(athlete.id, { goals: [...athlete.goals, newGoal.trim()] });
    setNewGoal('');
  };

  const removeGoal = (i: number) =>
    updateAthlete(athlete.id, { goals: athlete.goals.filter((_, gi) => gi !== i) });

  const handleDelete = () => {
    if (confirm('Удалить спортсмена?')) {
      deleteAthlete(athlete.id);
      router.push('/athletes');
    }
  };

  return (
    <PageShell>
      <Link href="/athletes" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ChevronLeft className="w-4 h-4" /> Спортсмены
      </Link>

      {/* Header */}
      <div className="card p-5 sm:p-7 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ocean-600 to-brand-500" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-ocean-600/25">
              {athlete.firstName[0]}{athlete.lastName[0]}
            </div>
            <div>
              <h1 className="page-title">
                {athlete.firstName} {athlete.lastName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                {calcAge(athlete.birthDate)} лет
                {athlete.weightKg ? ` · ${athlete.weightKg} кг` : ''}
                {athlete.experienceYears ? ` · стаж ${athlete.experienceYears} г.` : ''}
              </p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {group && <span className="badge-blue">{group.name}</span>}
                {athlete.category && <span className="badge-gray">{athlete.category}</span>}
                {athlete.rank && <span className="badge-orange">{athlete.rank}</span>}
              </div>
            </div>
          </div>
          <button onClick={handleDelete} className="btn-secondary text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Skills */}
        <div className="card p-5 sm:p-6">
          <h2 className="section-title mb-1">Навыки</h2>
          <p className="text-sm text-slate-400 mb-5">
            Нажмите на шкалу, чтобы изменить оценку (1–10)
          </p>
          <div className="space-y-4">
            {(Object.keys(athlete.skills) as (keyof AthleteSkills)[]).map((key) => {
              const val = athlete.skills[key];
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {SKILL_LABELS[key]}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {val}/10
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setSkill(key, i + 1)}
                        className={`h-3 flex-1 rounded-full transition-colors ${
                          i < val
                            ? i < 4
                              ? 'bg-red-400'
                              : i < 7
                              ? 'bg-brand-400'
                              : 'bg-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={`${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {/* Goals */}
          <div className="card p-5 sm:p-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-500" /> Цели
            </h2>
            {athlete.goals.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {athlete.goals.map((g, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-200">{g}</span>
                    <button onClick={() => removeGoal(i)} className="p-1 rounded hover:bg-brand-100 dark:hover:bg-brand-900/40 text-brand-400 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 mb-4">Целей пока нет</p>
            )}
            <div className="flex gap-2">
              <input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                placeholder="Новая цель…"
                className="input-base !py-2"
              />
              <button onClick={addGoal} className="btn-primary !py-2">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Competitions */}
          <div className="card p-5 sm:p-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Соревнования
            </h2>
            {athleteComps.length > 0 ? (
              <div className="space-y-2">
                {athleteComps.map((c) => {
                  const result = c.results.find((r) => r.athleteId === athlete.id);
                  return (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDateRu(c.date)} · {c.location}
                          </p>
                        </div>
                        {result?.place && (
                          <span className={`badge ${result.place === 1 ? 'badge-amber' : 'badge-gray'} shrink-0`}>
                            {result.place} место
                          </span>
                        )}
                      </div>
                      {result?.note && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          {result.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Соревнований пока нет</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function AthleteDetailPage() {
  return (
    <Suspense fallback={null}>
      <AthleteDetailInner />
    </Suspense>
  );
}
