'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Zap,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';

export default function Dashboard() {
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([
    {
      id: '1',
      time: '16:00',
      group: 'Начальная подготовка',
      theme: 'Координация + базовая техника',
      duration: 90,
      stage: 'beginner',
    },
    {
      id: '2',
      time: '18:00',
      group: 'Спортивная группа',
      theme: 'Контратака',
      duration: 120,
      stage: 'intermediate',
    },
  ]);

  const stats = {
    todayWorkouts: todayWorkouts.length,
    weeklyWorkouts: 12,
    athletes: 34,
    nextCompetition: '2 недели',
  };

  const stageColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Доброе утро!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Четверг, 21 августа 2025
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Тренировок сегодня
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.todayWorkouts}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  На неделю
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.weeklyWorkouts}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Спортсменов
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.athletes}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Соревнование
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.nextCompetition}
                </p>
              </div>
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Today's Workouts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Тренировки сегодня
            </h2>
            <button className="btn-ghost text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </button>
          </div>

          <div className="space-y-3">
            {todayWorkouts.map((workout) => (
              <div key={workout.id} className="card-hover p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {workout.time}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          stageColors[
                            workout.stage as keyof typeof stageColors
                          ]
                        }`}
                      >
                        {workout.group}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {workout.theme}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ⏱ {workout.duration} минут
                    </p>
                  </div>
                  <button className="btn-primary flex items-center gap-2">
                    Начать
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="card-hover p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Мои программы
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  3 активных программы
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <button className="card-hover p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Библиотека упражнений
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  156 упражнений
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <button className="card-hover p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Мои группы
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  5 групп
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
