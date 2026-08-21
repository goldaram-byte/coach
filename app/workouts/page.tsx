'use client';

import { useState } from 'react';
import { Calendar, Clock, Play } from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';

export default function WorkoutsPage() {
  const [workouts] = useState([
    {
      id: '1',
      date: '2025-08-21',
      time: '16:00',
      group: 'Дети 6-7 лет',
      theme: 'Координация + базовая техника',
      duration: 90,
      blocks: 6,
      exercises: 18,
    },
    {
      id: '2',
      date: '2025-08-21',
      time: '18:00',
      group: 'Спортивная группа',
      theme: 'Контратака',
      duration: 120,
      blocks: 7,
      exercises: 22,
    },
    {
      id: '3',
      date: '2025-08-22',
      time: '16:00',
      group: 'Дети 8-9 лет',
      theme: 'Физическая подготовка',
      duration: 60,
      blocks: 4,
      exercises: 12,
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Тренировки
        </h1>

        <div className="grid gap-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {workout.time}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {workout.theme}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {workout.group}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Начать
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{workout.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} мин</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦 {workout.blocks} блоков</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
