'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, Target } from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';

type ViewLevel = 'years' | 'periods' | 'months' | 'weeks' | 'days';

export default function ProgramDetailPage({
  params,
}: {
  params: { programId: string };
}) {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('years');
  const [breadcrumb, setBreadcrumb] = useState<
    { level: ViewLevel; id: string; name: string }[]
  >([]);

  // Demo data structure
  const years = [
    {
      id: 'y1',
      name: '1 год подготовки',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    },
    {
      id: 'y2',
      name: '2 год подготовки',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    },
  ];

  const periods = {
    y1: [
      {
        id: 'p1',
        name: 'Подготовительный период',
        type: 'preparation',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
      },
      {
        id: 'p2',
        name: 'Соревновательный период',
        type: 'competitive',
        startDate: '2025-04-01',
        endDate: '2025-10-31',
      },
      {
        id: 'p3',
        name: 'Восстановительный период',
        type: 'recovery',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
      },
    ],
  };

  const months = {
    p1: [
      {
        id: 'm1',
        name: 'Январь',
        goals: [
          'Адаптация к тренировкам',
          'Базовая техника',
        ],
      },
      {
        id: 'm2',
        name: 'Февраль',
        goals: [
          'Совершенствование техники',
          'Работа на дистанции',
        ],
      },
      {
        id: 'm3',
        name: 'Март',
        goals: ['Кумитэ', 'Работа в парах'],
      },
    ],
  };

  const weeks = {
    m1: [
      { id: 'w1', name: 'Неделя 1', startDate: '2025-01-01' },
      { id: 'w2', name: 'Неделя 2', startDate: '2025-01-08' },
      { id: 'w3', name: 'Неделя 3', startDate: '2025-01-15' },
      { id: 'w4', name: 'Неделя 4', startDate: '2025-01-22' },
    ],
  };

  const days = {
    w1: [
      {
        id: 'd1',
        name: 'Понедельник',
        date: '2025-01-01',
        isTrainingDay: true,
      },
      {
        id: 'd2',
        name: 'Вторник',
        date: '2025-01-02',
        isTrainingDay: true,
      },
      {
        id: 'd3',
        name: 'Среда',
        date: '2025-01-03',
        isTrainingDay: false,
      },
      {
        id: 'd4',
        name: 'Четверг',
        date: '2025-01-04',
        isTrainingDay: true,
      },
      {
        id: 'd5',
        name: 'Пятница',
        date: '2025-01-05',
        isTrainingDay: true,
      },
      {
        id: 'd6',
        name: 'Суббота',
        date: '2025-01-06',
        isTrainingDay: true,
      },
      {
        id: 'd7',
        name: 'Воскресенье',
        date: '2025-01-07',
        isTrainingDay: false,
      },
    ],
  };

  const workouts = {
    d1: [
      {
        id: 'w1',
        name: 'Координация + техника',
        goal: 'Развитие базовых координационных навыков',
        duration: 90,
        blocks: 6,
      },
    ],
    d2: [
      {
        id: 'w2',
        name: 'Физическая подготовка',
        goal: 'ОФП: сила и выносливость',
        duration: 60,
        blocks: 4,
      },
    ],
  };

  const handleDrill = (level: ViewLevel, id: string, name: string) => {
    setViewLevel(level);
    setBreadcrumb([...breadcrumb, { level, id, name }]);
  };

  const handleBack = () => {
    const newBreadcrumb = breadcrumb.slice(0, -1);
    setBreadcrumb(newBreadcrumb);
    if (newBreadcrumb.length === 0) {
      setViewLevel('years');
    } else {
      setViewLevel(newBreadcrumb[newBreadcrumb.length - 1].level);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleBack}
            disabled={breadcrumb.length === 0}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Начальная подготовка 2025
            </span>
            {breadcrumb.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
            ))}
          </nav>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {breadcrumb.length === 0
            ? 'Годовой план'
            : breadcrumb[breadcrumb.length - 1].name}
        </h1>

        {/* Years View */}
        {viewLevel === 'years' && (
          <div className="grid gap-4">
            {years.map((year) => (
              <button
                key={year.id}
                onClick={() =>
                  handleDrill('periods', year.id, year.name)
                }
                className="card-hover p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {year.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {year.startDate} - {year.endDate}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Periods View */}
        {viewLevel === 'periods' && (
          <div className="grid gap-4">
            {periods.y1?.map((period) => (
              <button
                key={period.id}
                onClick={() =>
                  handleDrill('months', period.id, period.name)
                }
                className="card-hover p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          period.type === 'preparation'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : period.type === 'competitive'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        }`}
                      >
                        {period.type === 'preparation'
                          ? 'Подготовительный'
                          : period.type === 'competitive'
                          ? 'Соревновательный'
                          : 'Восстановительный'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {period.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {period.startDate} - {period.endDate}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Months View */}
        {viewLevel === 'months' && (
          <div className="grid gap-4">
            {months.p1?.map((month) => (
              <button
                key={month.id}
                onClick={() =>
                  handleDrill('weeks', month.id, month.name)
                }
                className="card-hover p-6 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {month.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Цели месяца:
                  </p>
                  <ul className="space-y-1">
                    {month.goals.map((goal, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                        • {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Weeks View */}
        {viewLevel === 'weeks' && (
          <div className="grid gap-4">
            {weeks.m1?.map((week) => (
              <button
                key={week.id}
                onClick={() =>
                  handleDrill('days', week.id, week.name)
                }
                className="card-hover p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {week.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Начало: {week.startDate}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Days View */}
        {viewLevel === 'days' && (
          <div className="grid gap-3">
            {days.w1?.map((day) => (
              <button
                key={day.id}
                className="card-hover p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          day.isTrainingDay
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'bg-gray-100 dark:bg-slate-800'
                        }`}
                      >
                        <Calendar
                          className={`w-5 h-5 ${
                            day.isTrainingDay
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {day.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {day.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  {day.isTrainingDay && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Workouts for this day */}
                {workouts[day.id as keyof typeof workouts] && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    {workouts[day.id as keyof typeof workouts].map(
                      (workout) => (
                        <div
                          key={workout.id}
                          className="text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {workout.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {workout.goal}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>⏱ {workout.duration} мин</span>
                            <span>📦 {workout.blocks} блоков</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
