'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Trophy,
  Users,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  BookOpen,
  Hammer,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import { useAppStore } from '@/store/appStore';
import { useHydrated } from '@/lib/useHydrated';
import { todayISO } from '@/lib/seed';
import { formatDateFullRu, formatDateRu, plural } from '@/lib/labels';

export default function Dashboard() {
  const hydrated = useHydrated();
  const workouts = useAppStore((s) => s.workouts);
  const athletes = useAppStore((s) => s.athletes);
  const groups = useAppStore((s) => s.groups);
  const competitions = useAppStore((s) => s.competitions);
  const exercises = useAppStore((s) => s.exercises);

  if (!hydrated) {
    return (
      <PageShell>
        <div className="h-40 card animate-pulse" />
      </PageShell>
    );
  }

  const today = todayISO();
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';

  const todayWorkouts = workouts
    .filter((w) => w.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcoming = workouts
    .filter((w) => w.date > today && w.status === 'planned')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const completedThisWeek = workouts.filter(
    (w) => w.status === 'completed' && new Date(w.date) >= weekAgo
  ).length;

  const nextCompetition = competitions
    .filter((c) => c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const daysToComp = nextCompetition
    ? Math.round((new Date(nextCompetition.date).getTime() - new Date(today).getTime()) / 86400000)
    : null;

  return (
    <PageShell>
      {/* Hero */}
      <div className="hero-gradient rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-brand-500/20 blur-2xl" />
        <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-ocean-400/20 blur-xl" />
        <p className="text-ocean-200 text-sm font-medium capitalize">{formatDateFullRu(today)}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">
          {greeting}, тренер!
        </h1>
        <p className="mt-2 text-ocean-100">
          {todayWorkouts.length > 0 ? (
            <>
              Сегодня{' '}
              <span className="font-bold text-brand-400">
                {todayWorkouts.length}{' '}
                {plural(todayWorkouts.length, 'тренировка', 'тренировки', 'тренировок')}
              </span>
              {nextCompetition && daysToComp !== null && (
                <>
                  {' '}· до соревнований{' '}
                  <span className="font-bold text-brand-400">
                    {daysToComp} {plural(daysToComp, 'день', 'дня', 'дней')}
                  </span>
                </>
              )}
            </>
          ) : (
            'Сегодня тренировок нет — время для планирования'
          )}
        </p>
        {todayWorkouts.length > 0 && (
          <Link
            href={`/run?id=${todayWorkouts[0].id}`}
            className="btn-primary mt-5 no-underline"
          >
            Начать первую тренировку <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          {
            label: 'Тренировок сегодня',
            value: todayWorkouts.length,
            icon: CalendarDays,
            color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30',
          },
          {
            label: 'Выполнено за неделю',
            value: completedThisWeek,
            icon: CheckCircle2,
            color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
          },
          {
            label: 'Спортсменов',
            value: athletes.length,
            icon: Users,
            color: 'text-ocean-600 bg-ocean-50 dark:bg-ocean-900/30',
          },
          {
            label: 'До соревнований',
            value: daysToComp !== null ? `${daysToComp} дн.` : '—',
            icon: Trophy,
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 sm:p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Today's workouts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Тренировки сегодня</h2>
          <Link href="/builder" className="text-sm font-semibold text-ocean-600 dark:text-ocean-400 no-underline hover:underline">
            + Создать тренировку
          </Link>
        </div>
        {todayWorkouts.length > 0 ? (
          <div className="space-y-3">
            {todayWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">На сегодня тренировок нет</p>
            <Link href="/builder" className="btn-primary no-underline">
              Создать тренировку
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Ближайшие тренировки</h2>
            <Link href="/calendar" className="text-sm font-semibold text-ocean-600 dark:text-ocean-400 no-underline hover:underline">
              Календарь →
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((w) => (
              <WorkoutCard key={w.id} workout={w} showDate />
            ))}
          </div>
        </div>
      )}

      {/* Next competition */}
      {nextCompetition && (
        <div className="mb-8">
          <h2 className="section-title mb-4">Ближайшие соревнования</h2>
          <Link href="/competitions" className="card-hover p-5 sm:p-6 flex items-center justify-between gap-4 no-underline block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{nextCompetition.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateRu(nextCompetition.date)} · {nextCompetition.location} ·{' '}
                  {nextCompetition.athleteIds.length}{' '}
                  {plural(nextCompetition.athleteIds.length, 'спортсмен', 'спортсмена', 'спортсменов')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </Link>
        </div>
      )}

      {/* Quick access */}
      <h2 className="section-title mb-4">Быстрый доступ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            href: '/programs',
            icon: BookOpen,
            title: 'Программы подготовки',
            subtitle: `3 этапа подготовки`,
            color: 'from-ocean-500 to-ocean-700',
          },
          {
            href: '/exercises',
            icon: Dumbbell,
            title: 'Библиотека упражнений',
            subtitle: `${exercises.length} ${plural(exercises.length, 'упражнение', 'упражнения', 'упражнений')}`,
            color: 'from-brand-400 to-brand-600',
          },
          {
            href: '/groups',
            icon: Users,
            title: 'Мои группы',
            subtitle: `${groups.length} ${plural(groups.length, 'группа', 'группы', 'групп')}`,
            color: 'from-emerald-400 to-emerald-600',
          },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card-hover p-5 no-underline block">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
              <item.icon className="w-5.5 h-5.5 text-white w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.subtitle}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
