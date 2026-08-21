'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, X, Save } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore, genId } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { calcAge, plural } from '@/lib/labels';
import { Athlete } from '@/lib/types';

export default function AthletesPage() {
  const hydrated = useHydrated();
  const athletes = useAppStore((s) => s.athletes);
  const groups = useAppStore((s) => s.groups);
  const addAthlete = useAppStore((s) => s.addAthlete);

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('2014-01-01');
  const [groupId, setGroupId] = useState('');

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const filtered = athletes.filter((a) => {
    const s = search.toLowerCase();
    return (
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(s) &&
      (!groupFilter || a.groupId === groupFilter)
    );
  });

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    const a: Athlete = {
      id: genId('ath'),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      groupId: groupId || undefined,
      skills: {
        speed: 5, reaction: 5, technique: 5, tactics: 5,
        endurance: 5, strength: 5, flexibility: 5, psychology: 5,
      },
      goals: [],
    };
    addAthlete(a);
    setShowForm(false);
    setFirstName('');
    setLastName('');
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="page-title">Спортсмены</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {athletes.length} {plural(athletes.length, 'спортсмен', 'спортсмена', 'спортсменов')}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени…"
            className="input-base pl-11"
          />
        </div>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="input-base w-auto"
        >
          <option value="">Все группы</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((a) => {
          const group = groups.find((g) => g.id === a.groupId);
          const avgSkill =
            Object.values(a.skills).reduce((s, v) => s + v, 0) / Object.values(a.skills).length;
          return (
            <Link key={a.id} href={`/athletes/${a.id}`} className="card-hover p-5 no-underline block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center text-white font-bold shadow-md shadow-ocean-600/25">
                  {a.firstName[0]}{a.lastName[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">
                    {a.firstName} {a.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {calcAge(a.birthDate)} лет{a.category ? ` · ${a.category}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {group && <span className="badge-blue">{group.name}</span>}
                  {a.rank && <span className="badge-orange">{a.rank}</span>}
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Общий уровень</span>
                  <span className="font-bold tabular-nums">{avgSkill.toFixed(1)}/10</span>
                </div>
                <div className="progress-track h-1.5">
                  <div className="progress-fill-orange" style={{ width: `${avgSkill * 10}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">Спортсмены не найдены</p>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Новый спортсмен</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-base">Имя *</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Фамилия *</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-base" />
                </div>
              </div>
              <div>
                <label className="label-base">Дата рождения</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="label-base">Группа</label>
                <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="input-base">
                  <option value="">Без группы</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleCreate} className="btn-primary w-full">
                <Save className="w-4 h-4" /> Добавить спортсмена
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
