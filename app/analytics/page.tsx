'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import { TrendingUp, Users, CheckCircle, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Аналитика
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Всего тренировок
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  312
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Выполнено
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  298
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Посещаемость
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  95%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Спортсменов
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  34
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Group Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              По группам
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Дети 6-7 лет', workouts: 45, attendance: 92 },
                { name: 'Дети 8-9 лет', workouts: 52, attendance: 96 },
                { name: 'Спортивная группа', workouts: 38, attendance: 98 },
              ].map((group, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {group.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {group.workouts} тренировок
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${group.attendance}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Посещаемость: {group.attendance}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Популярные упражнения
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Gyaku-zuki', count: 48 },
                { name: 'Отжимания', count: 42 },
                { name: 'Приседания', count: 38 },
                { name: 'Mawashi-geri', count: 35 },
              ].map((exercise, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.count} раз
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(exercise.count / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Progress */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Прогресс программ
          </h2>
          <div className="space-y-4">
            {[
              {
                name: 'Начальная подготовка - 2025',
                progress: 65,
              },
              {
                name: 'Спортивная группа - 2025',
                progress: 45,
              },
              {
                name: 'Спортивное совершенствование',
                progress: 80,
              },
            ].map((program, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {program.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {program.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
