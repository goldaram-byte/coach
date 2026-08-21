'use client';

import { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import { EXERCISE_CATEGORIES, TRAINING_STAGES } from '@/lib/constants';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([
    {
      id: '1',
      name: 'Gyaku-zuki',
      category: 'kumite',
      stage: 'beginner',
      duration: 5,
      difficulty: 'beginner',
      videos: 2,
    },
    {
      id: '2',
      name: 'Отжимания',
      category: 'ofp',
      stage: 'beginner',
      duration: 3,
      difficulty: 'beginner',
      videos: 1,
    },
    {
      id: '3',
      name: 'Mawashi-geri',
      category: 'kumite',
      stage: 'intermediate',
      duration: 8,
      difficulty: 'intermediate',
      videos: 3,
    },
    {
      id: '4',
      name: 'Приседания на одной ноге',
      category: 'sfp',
      stage: 'intermediate',
      duration: 4,
      difficulty: 'advanced',
      videos: 1,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exercises.filter((ex) => {
    const matchCategory = !selectedCategory || ex.category === selectedCategory;
    const matchSearch = ex.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryName = (catId: string) => {
    return Object.values(EXERCISE_CATEGORIES).find(
      (c) => c.id === catId
    )?.name || catId;
  };

  const getStageName = (stageId: string) => {
    return Object.values(TRAINING_STAGES).find(
      (s) => s.id === stageId
    )?.name || stageId;
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner')
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (difficulty === 'intermediate')
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
    if (difficulty === 'advanced')
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Библиотека упражнений
          </h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Новое упражнение
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск упражнений..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === null
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              Все категории
            </button>
            {Object.values(EXERCISE_CATEGORIES).map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid gap-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exercise.name}
                  </h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
                      {getCategoryName(exercise.category)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded">
                      {getStageName(exercise.stage)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
                        exercise.difficulty
                      )}`}
                    >
                      {exercise.difficulty === 'beginner'
                        ? 'Начальный'
                        : exercise.difficulty === 'intermediate'
                        ? 'Средний'
                        : 'Продвинутый'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span>⏱ {exercise.duration} мин</span>
                <span>🎬 {exercise.videos} видео</span>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Упражнения не найдены
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
