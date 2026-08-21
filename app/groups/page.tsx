'use client';

import { useState } from 'react';
import { Plus, Users, Clock } from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import { TRAINING_STAGES } from '@/lib/constants';

export default function GroupsPage() {
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Дети 6-7 лет',
      ageMin: 6,
      ageMax: 7,
      stage: 'beginner',
      athletes: 12,
      schedule: 'Пн, Ср, Пт 16:00',
    },
    {
      id: '2',
      name: 'Дети 8-9 лет',
      ageMin: 8,
      ageMax: 9,
      stage: 'beginner',
      athletes: 15,
      schedule: 'Вт, Чт 16:00',
    },
    {
      id: '3',
      name: 'Спортивная группа',
      ageMin: 10,
      ageMax: 14,
      stage: 'intermediate',
      athletes: 8,
      schedule: 'Пн-Пт 18:00',
    },
  ]);

  const getStageName = (stageId: string) => {
    return Object.values(TRAINING_STAGES).find(
      (s) => s.id === stageId
    )?.name || stageId;
  };

  const getStageColor = (stageId: string) => {
    const stage = Object.values(TRAINING_STAGES).find(
      (s) => s.id === stageId
    );
    if (stage?.id === 'beginner')
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (stage?.id === 'intermediate')
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
    if (stage?.id === 'advanced')
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Мои группы
          </h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Новая группа
          </button>
        </div>

        <div className="grid gap-4">
          {groups.map((group) => (
            <div key={group.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {group.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStageColor(
                        group.stage
                      )}`}
                    >
                      {getStageName(group.stage)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Возраст: {group.ageMin}-{group.ageMax} лет
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{group.athletes} спортсменов</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{group.schedule}</span>
                </div>
              </div>

              <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors">
                Открыть группу
              </button>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Групп нет
            </p>
            <button className="btn-primary">Создать первую группу</button>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
