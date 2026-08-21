'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Users, Clock, X, Save, BookOpen } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore, genId } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { STAGE_BADGE, STAGE_LABELS, WEEKDAY_SHORT, plural } from '@/lib/labels';
import { Group, StageId } from '@/lib/types';

export default function GroupsPage() {
  const hydrated = useHydrated();
  const groups = useAppStore((s) => s.groups);
  const athletes = useAppStore((s) => s.athletes);
  const programs = useAppStore((s) => s.programs);
  const addGroup = useAppStore((s) => s.addGroup);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [ageMin, setAgeMin] = useState(6);
  const [ageMax, setAgeMax] = useState(9);
  const [stage, setStage] = useState<StageId>('beginner');
  const [days, setDays] = useState<number[]>([0, 2, 4]);
  const [time, setTime] = useState('16:00');

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const handleCreate = () => {
    if (!name.trim()) return;
    const g: Group = {
      id: genId('grp'),
      name: name.trim(),
      ageMin,
      ageMax,
      stage,
      schedule: days.sort().map((d) => ({ weekday: d, time })),
      programId: programs.find((p) => p.stage === stage)?.id,
    };
    addGroup(g);
    setShowForm(false);
    setName('');
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="page-title">Мои группы</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Новая группа
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {groups.map((group) => {
          const members = athletes.filter((a) => a.groupId === group.id);
          const program = programs.find((p) => p.id === group.programId);
          return (
            <div key={group.id} className="card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {group.ageMin}–{group.ageMax} лет
                  </p>
                </div>
                <span className={STAGE_BADGE[group.stage]}>{STAGE_LABELS[group.stage]}</span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ocean-500" />
                  {members.length} {plural(members.length, 'спортсмен', 'спортсмена', 'спортсменов')}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500" />
                  {group.schedule.map((s) => WEEKDAY_SHORT[s.weekday]).join(', ')} ·{' '}
                  {group.schedule[0]?.time}
                </p>
                {program && (
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <Link href={`/programs/${program.id}`} className="no-underline text-ocean-600 dark:text-ocean-400 hover:underline">
                      {program.name}
                    </Link>
                  </p>
                )}
              </div>

              {members.length > 0 && (
                <div className="flex -space-x-2 mt-4">
                  {members.slice(0, 6).map((a) => (
                    <Link
                      key={a.id}
                      href={`/athletes/${a.id}`}
                      title={`${a.firstName} ${a.lastName}`}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold no-underline"
                    >
                      {a.firstName[0]}
                      {a.lastName[0]}
                    </Link>
                  ))}
                  {members.length > 6 && (
                    <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      +{members.length - 6}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Новая группа</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-base">Название *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Дети 10–11 лет" className="input-base" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-base">Возраст от</label>
                  <input type="number" min={4} value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className="input-base" />
                </div>
                <div>
                  <label className="label-base">Возраст до</label>
                  <input type="number" min={4} value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} className="input-base" />
                </div>
              </div>
              <div>
                <label className="label-base">Этап подготовки</label>
                <select value={stage} onChange={(e) => setStage(e.target.value as StageId)} className="input-base">
                  {(Object.keys(STAGE_LABELS) as StageId[]).map((s) => (
                    <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base">Дни тренировок</label>
                <div className="flex gap-1.5 flex-wrap">
                  {WEEKDAY_SHORT.map((d, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setDays((ds) => (ds.includes(i) ? ds.filter((x) => x !== i) : [...ds, i]))
                      }
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                        days.includes(i)
                          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-base">Время</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-base" />
              </div>
              <button onClick={handleCreate} className="btn-primary w-full">
                <Save className="w-4 h-4" /> Создать группу
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
