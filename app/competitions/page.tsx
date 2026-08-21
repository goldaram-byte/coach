'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Trophy, MapPin, X, Save, Medal } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore, genId } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { formatDateRu, plural } from '@/lib/labels';
import { todayISO } from '@/lib/seed';
import { Competition } from '@/lib/types';

export default function CompetitionsPage() {
  const hydrated = useHydrated();
  const competitions = useAppStore((s) => s.competitions);
  const athletes = useAppStore((s) => s.athletes);
  const addCompetition = useAppStore((s) => s.addCompetition);
  const updateCompetition = useAppStore((s) => s.updateCompetition);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO());
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const [resultsFor, setResultsFor] = useState<Competition | null>(null);

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const today = todayISO();
  const upcoming = competitions
    .filter((c) => c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = competitions
    .filter((c) => c.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleCreate = () => {
    if (!name.trim()) return;
    addCompetition({
      id: genId('comp'),
      name: name.trim(),
      date,
      location: location.trim(),
      category: category.trim(),
      athleteIds: selectedAthletes,
      results: [],
    });
    setShowForm(false);
    setName('');
    setSelectedAthletes([]);
  };

  const setResult = (compId: string, athleteId: string, place: number | undefined) => {
    const comp = competitions.find((c) => c.id === compId);
    if (!comp) return;
    const others = comp.results.filter((r) => r.athleteId !== athleteId);
    const existing = comp.results.find((r) => r.athleteId === athleteId);
    updateCompetition(compId, {
      results: [...others, { ...existing, athleteId, place }],
    });
  };

  const CompCard = ({ comp, isPast }: { comp: Competition; isPast: boolean }) => (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-4 flex-1 min-w-[240px]">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
            isPast
              ? 'bg-slate-100 dark:bg-slate-800'
              : 'bg-gradient-to-br from-amber-400 to-brand-500 shadow-brand-500/30'
          }`}>
            <Trophy className={`w-6 h-6 ${isPast ? 'text-slate-400' : 'text-white'}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{comp.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-ocean-600 dark:text-ocean-400">
                {formatDateRu(comp.date)}
              </span>
              {comp.location && (
                <>
                  · <MapPin className="w-3.5 h-3.5" /> {comp.location}
                </>
              )}
            </p>
            {comp.category && <span className="badge-gray mt-2">{comp.category}</span>}
          </div>
        </div>
        <button onClick={() => setResultsFor(comp)} className="btn-secondary text-sm">
          <Medal className="w-4 h-4" />
          {isPast ? 'Результаты' : 'Участники'}
        </button>
      </div>

      {comp.athleteIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
          {comp.athleteIds.map((aid) => {
            const a = athletes.find((x) => x.id === aid);
            const r = comp.results.find((x) => x.athleteId === aid);
            if (!a) return null;
            return (
              <Link
                key={aid}
                href={`/athlete?id=${aid}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 no-underline hover:bg-ocean-50 dark:hover:bg-ocean-900/20"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {a.firstName} {a.lastName}
                </span>
                {r?.place && (
                  <span className={`text-xs font-bold ${
                    r.place === 1 ? 'text-amber-500' : r.place <= 3 ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {r.place} место
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="page-title">Соревнования</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {upcoming.length > 0 && (
        <>
          <h2 className="section-title mb-4">Предстоящие</h2>
          <div className="space-y-3 mb-8">
            {upcoming.map((c) => (
              <CompCard key={c.id} comp={c} isPast={false} />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 className="section-title mb-4">Прошедшие</h2>
          <div className="space-y-3">
            {past.map((c) => (
              <CompCard key={c.id} comp={c} isPast />
            ))}
          </div>
        </>
      )}

      {competitions.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Соревнований пока нет</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Добавить соревнование
          </button>
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Новое соревнование</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-base">Название *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-base">Дата</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Категория</label>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Кадеты…" className="input-base" />
                </div>
              </div>
              <div>
                <label className="label-base">Место проведения</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="label-base">Спортсмены</label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {athletes.map((a) => (
                    <label key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAthletes.includes(a.id)}
                        onChange={() =>
                          setSelectedAthletes((s) =>
                            s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id]
                          )
                        }
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        {a.firstName} {a.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleCreate} className="btn-primary w-full">
                <Save className="w-4 h-4" /> Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results modal */}
      {resultsFor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setResultsFor(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Результаты</h3>
              <button onClick={() => setResultsFor(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">{resultsFor.name}</p>
            <div className="space-y-3">
              {resultsFor.athleteIds.map((aid) => {
                const a = athletes.find((x) => x.id === aid);
                const current = competitions
                  .find((c) => c.id === resultsFor.id)
                  ?.results.find((r) => r.athleteId === aid);
                if (!a) return null;
                return (
                  <div key={aid} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                      {a.firstName} {a.lastName}
                    </span>
                    <select
                      value={current?.place ?? ''}
                      onChange={(e) =>
                        setResult(resultsFor.id, aid, e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="input-base !w-auto !py-1.5 text-sm"
                    >
                      <option value="">Без места</option>
                      {[1, 2, 3, 5, 7, 9].map((p) => (
                        <option key={p} value={p}>{p} место</option>
                      ))}
                    </select>
                  </div>
                );
              })}
              {resultsFor.athleteIds.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">
                  Участники не добавлены
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
