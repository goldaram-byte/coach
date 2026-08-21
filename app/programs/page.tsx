'use client';

import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import { TRAINING_STAGES } from '@/lib/constants';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([
    {
      id: '1',
      stage: 'beginner',
      name: 'Начальная подготовка - 2025',
      year: 1,
      athletes: 15,
      status: 'active',
      progress: 65,
    },
    {
      id: '2',
      stage: 'intermediate',
      name: 'Спортивная группа - 2025',
      year: 2,
      athletes: 8,
      status: 'active',
      progress: 45,
    },
    {
      id: '3',
      stage: 'advanced',
      name: 'Спортивное совершенствование',
      year: 3,
      athletes: 3,
      status: 'active',
      progress: 80,
    },
  ]);

  const getStageColor = (stageId: string) => {
    const stage = Object.values(TRAINING_STAGES).find(
      (s) => s.id === stageId
    );
    if (stage?.id === 'beginner') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (stage?.id === 'intermediate') return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
    if (stage?.id === 'advanced') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    return 'bg-gray-100 text-gray-800';
  };

  const getStageName = (stageId: string) => {
    return Object.values(TRAINING_STAGES).find(
      (s) => s.id === stageId
    )?.name || stageId;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Программы подготовки
          </h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Новая программа
          </button>
        </div>

        <div className="grid gap-4">
          {programs.map((program) => (
            <div key={program.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStageColor(
                        program.stage
                      )}`}
                    >
                      {getStageName(program.stage)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
                      Год {program.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {program.athletes} спортсменов
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Выполнено
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {program.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
              </div>

              <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors">
                Открыть программу
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {programs.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Программ подготовки нет
            </p>
            <button className="btn-primary">Создать первую программу</button>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
