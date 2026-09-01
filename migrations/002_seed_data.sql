-- Seed data for KARATE WKF COACH

-- Training Stages
INSERT INTO training_stages (id, name, description, level, color) VALUES
  ('stage-beginner', 'Начальная подготовка', 'Создание физической, технической и координационной базы', 1, '#10b981'),
  ('stage-intermediate', 'Спортивная группа', 'Специализированная спортивная подготовка и соревновательная деятельность', 2, '#f59e0b'),
  ('stage-advanced', 'Спортивное совершенствование', 'Подготовка к высоким спортивным результатам', 3, '#ef4444');

-- Exercise Categories
INSERT INTO exercise_categories (id, name, description) VALUES
  ('cat-kumite', 'Кумитэ', 'Упражнения для спарринга и боевой подготовки'),
  ('cat-kata', 'Ката', 'Комбинированные последовательности движений'),
  ('cat-ofp', 'ОФП', 'Общая физическая подготовка'),
  ('cat-sfp', 'СФП', 'Специальная физическая подготовка'),
  ('cat-tactics', 'Тактика', 'Тактические упражнения'),
  ('cat-psychology', 'Психология', 'Психологическая подготовка');

-- Workout Blocks (predefined blocks used in workouts)
INSERT INTO workout_blocks (id, name, description, display_order) VALUES
  ('block-warmup', 'Разминка', 'Разминка и подготовка к тренировке', 1),
  ('block-leg-work', 'Работа ног', 'Передвижения и работа на дистанции', 2),
  ('block-technique', 'Техническая подготовка', 'Изучение и совершенствование техники', 3),
  ('block-pair-work', 'Работа в парах', 'Упражнения с партнером', 4),
  ('block-sfp', 'СФП', 'Специальная физическая подготовка', 5),
  ('block-cooldown', 'Заминка', 'Восстановление и завершение тренировки', 6),
  ('block-kumite', 'Кумитэ', 'Спарринг и боевая практика', 4),
  ('block-kata', 'Ката', 'Практика ката', 3),
  ('block-ofp', 'ОФП', 'Общая физическая подготовка', 5);

-- Note: To use this seed data, you need:
-- 1. A coach user (created through auth)
-- 2. The coach's UUID in the coaches table

-- Example exercises (these reference cat-* IDs from exercise_categories)
-- Uncomment and modify with actual coach_id after creating a coach

/*
INSERT INTO exercises (
  coach_id, category_id, name, description, goals,
  duration_minutes, sets, reps, difficulty_level, training_stage_id
) VALUES
  (
    'coach-uuid-here',
    'cat-kumite',
    'Gyaku-zuki',
    'Обратный удар рукой',
    'Развитие силы и скорости удара',
    5, 3, 20, 'beginner', 'stage-beginner'
  ),
  (
    'coach-uuid-here',
    'cat-ofp',
    'Отжимания',
    'Классические отжимания от пола',
    'Развитие силы верхней части тела',
    3, 3, 15, 'beginner', 'stage-beginner'
  ),
  (
    'coach-uuid-here',
    'cat-kumite',
    'Mawashi-geri',
    'Круговой удар ногой',
    'Развитие гибкости и скорости',
    8, 3, 15, 'intermediate', 'stage-intermediate'
  ),
  (
    'coach-uuid-here',
    'cat-sfp',
    'Приседания на одной ноге',
    'Приседания на одной ноге',
    'Развитие взрывной силы',
    4, 3, 10, 'advanced', 'stage-intermediate'
  ),
  (
    'coach-uuid-here',
    'cat-kata',
    'Heian Shodan',
    'Первая ката серии Heian',
    'Координация и техника',
    10, 3, 5, 'beginner', 'stage-beginner'
  ),
  (
    'coach-uuid-here',
    'cat-psychology',
    'Медитация и концентрация',
    'Дыхательные упражнения и медитация',
    'Развитие концентрации',
    15, 1, 1, 'beginner', 'stage-beginner'
  );
*/

-- Note: The data above is commented because it requires actual coach UUIDs.
-- After creating a coach account through the app, uncomment and add the coach_id
-- to properly seed exercise data.

-- This seed file sets up the foundational tables.
-- The app will generate additional demo data at runtime if needed.
