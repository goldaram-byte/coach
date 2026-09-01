'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trophy } from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { MONTH_LABELS, WEEKDAY_SHORT, STAGE_DOT } from '@/lib/labels';
import { todayISO } from '@/lib/seed';

export default function CalendarPage() {
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);
  const competitions = useAppStore((s) => s.competitions);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  if (!hydrated)
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // 0 = Monday

  const cells: (string | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
    }),
  ];

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const today = todayISO();
  const dayWorkouts = workouts
    .filter((w) => w.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const dayComps = competitions.filter((c) => c.date === selectedDate);

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="page-title">Мой календарь</h1>
        <Link href={`/builder?date=${selectedDate}`} className="btn-primary no-underline">
          <Plus className="w-4 h-4" /> Тренировка
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        {/* Calendar */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {MONTH_LABELS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {WEEKDAY_SHORT.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-semibold py-1 ${
                  i >= 5 ? 'text-brand-500' : 'text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;
              const dw = workouts.filter((w) => w.date === date);
              const dc = competitions.filter((c) => c.date === date);
              const isToday = date === today;
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-br from-ocean-600 to-ocean-700 text-white shadow-md shadow-ocean-600/25'
                      : isToday
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="text-sm tabular-nums">{Number(date.slice(8))}</span>
                  <div className="flex gap-0.5 mt-0.5 h-1.5">
                    {dw.slice(0, 3).map((w) => (
                      <span
                        key={w.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : STAGE_DOT[w.stage]
                        }`}
                      />
                    ))}
                    {dc.length > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Начальная
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Спортивная
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Совершенствование
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-amber-500" /> Соревнования
            </span>
          </div>
        </div>

        {/* Day panel */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>

          {dayComps.map((c) => (
            <Link
              key={c.id}
              href="/competitions"
              className="block p-3 mb-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 no-underline"
            >
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> {c.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{c.location}</p>
            </Link>
          ))}

          {dayWorkouts.length > 0 ? (
            <div className="space-y-2">
              {dayWorkouts.map((w) => (
                <Link
                  key={w.id}
                  href={`/workout?id=${w.id}`}
                  className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 transition-colors no-underline"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STAGE_DOT[w.stage]}`} />
                    <span className="font-bold text-ocean-700 dark:text-ocean-300 tabular-nums text-sm">
                      {w.time}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                      {w.theme}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            dayComps.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-3">Нет событий</p>
                <Link href={`/builder?date=${selectedDate}`} className="btn-outline text-sm no-underline">
                  <Plus className="w-4 h-4" /> Добавить тренировку
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </PageShell>
  );
}
