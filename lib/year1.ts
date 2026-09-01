// ===== Стандартный тренировочный план — Раздел 1 =====
// «Начальная подготовка, 1 год обучения» (WKF Kumite).
// Методика зашита в приложение и не может быть изменена тренерами.

import { CategoryId, Exercise, Workout, WorkoutBlock } from './types';
import exercisesJson from './data/year1-exercises.json';
import workoutsJson from './data/year1-workouts.json';
import assessmentsJson from './data/year1-assessments.json';

// ---------- Типы данных методики ----------

export interface PlanExercise {
  id: string;
  name: string;
  category: string;
  direction: string;
  levels: { L1: string; L2: string; L3: string };
  quality_criteria: string[];
  common_errors: string[];
  kumite_link: string;
  prerequisites: string[];
}

export interface PlanBlock {
  type: string;
  duration_min: number;
  exercise_ids?: string[];
  mandatory?: boolean;
  order?: string;
  notes?: string;
}

export interface PlanWorkout {
  id: string;
  week: number;
  session: 'A' | 'B' | 'C';
  theme: string;
  phase: string;
  duration_min: number;
  blocks: PlanBlock[];
  progression: string;
  coach_note: string;
}

export interface PlanAssessments {
  weeks: number[];
  scale: Record<string, string>;
  domains: string[];
}

export const planExercises = exercisesJson as PlanExercise[];
export const planWorkouts = workoutsJson as PlanWorkout[];
export const planAssessments = assessmentsJson as PlanAssessments;

// ---------- Справочники ----------

export const planExerciseById: Record<string, PlanExercise> = Object.fromEntries(
  planExercises.map((e) => [e.id, e])
);

export const PLAN_BLOCK_LABELS: Record<string, string> = {
  organization: 'Организация',
  joint_warmup: 'Суставная разминка',
  dynamic_warmup: 'Динамическая разминка',
  general_physical: 'ОФП',
  special_physical: 'СФП',
  technique: 'Техника',
  partner: 'Работа в парах',
  game: 'Игровое кумитэ',
  cooldown: 'Заминка',
};

export const PLAN_CATEGORY_LABELS: Record<string, string> = {
  joint_warmup: 'Суставная разминка',
  dynamic: 'Динамическая разминка',
  general_physical: 'ОФП',
  special_physical: 'СФП',
  kumite_technique: 'Техника кумитэ',
  reaction_coordination: 'Реакция и координация',
  tactics_games: 'Тактика и игры',
  psychology_recovery: 'Психология и восстановление',
};

export interface PlanPhase {
  name: string;
  short: string;
  weeks: number[];
  color: string; // tailwind classes for the badge
}

const phaseOrder = ['I. Адаптация', 'II. База СФП и техники', 'III. Специализация', 'IV. Игровая интеграция'];

export const planPhases: PlanPhase[] = phaseOrder.map((name, i) => {
  const weeks = Array.from(
    new Set(planWorkouts.filter((w) => w.phase === name).map((w) => w.week))
  ).sort((a, b) => a - b);
  const colors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-300',
    'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  ];
  return { name, short: name.split('. ')[1] ?? name, weeks, color: colors[i] };
});

export const planWeekWorkouts = (week: number): PlanWorkout[] =>
  planWorkouts
    .filter((w) => w.week === week)
    .sort((a, b) => a.session.localeCompare(b.session));

export const planWorkoutById = (id: string): PlanWorkout | undefined =>
  planWorkouts.find((w) => w.id === id);

export const phaseOfWeek = (week: number): PlanPhase | undefined =>
  planPhases.find((p) => p.weeks.includes(week));

// ---------- Прогресс тренера по стандартному плану ----------

const orderedPlanWorkouts = planWorkouts
  .slice()
  .sort((a, b) => a.week - b.week || a.session.localeCompare(b.session));

/**
 * Определяет по личным тренировкам тренера, какие занятия стандартного
 * плана уже проведены, а какие запланированы (по префиксу id копии).
 */
export const planProgress = (
  workouts: Workout[]
): { done: Set<string>; planned: Set<string> } => {
  const done = new Set<string>();
  const planned = new Set<string>();
  for (const w of workouts) {
    const m = w.id.match(/^wk-y1-(W\d{2}[ABC])-/);
    if (!m) continue;
    if (w.status === 'completed') done.add(m[1]);
    else planned.add(m[1]);
  }
  return { done, planned };
};

/** Первое занятие плана, которое ещё не проведено. */
export const nextPlanWorkout = (done: Set<string>): PlanWorkout | undefined =>
  orderedPlanWorkouts.find((w) => !done.has(w.id));

/** Копия занятия плана в личных тренировках (если уже есть). */
export const findPlanCopy = (workouts: Workout[], planId: string): Workout | undefined =>
  workouts.find((w) => w.id.startsWith(`wk-y1-${planId}-`));

// ---------- Конвертация в личный план тренера ----------

/**
 * Уровни, которые план предписывает всей группе на данном занятии
 * (поле progression тренировки: 'L1', 'L1-L2', 'L2', 'L2-L3').
 * Группа не делится — уровень единый и растёт по ходу года.
 */
export const progressionLevels = (progression: string): ('L1' | 'L2' | 'L3')[] => {
  const lvls = (['L1', 'L2', 'L3'] as const).filter((l) => progression.includes(l));
  return lvls.length ? lvls : ['L1'];
};

const CATEGORY_MAP: Record<string, CategoryId> = {
  joint_warmup: 'ofp',
  dynamic: 'ofp',
  general_physical: 'ofp',
  special_physical: 'sfp',
  kumite_technique: 'kumite',
  reaction_coordination: 'sfp',
  tactics_games: 'tactics',
  psychology_recovery: 'psychology',
};

export const planExerciseToExercise = (
  pe: PlanExercise,
  durationMin: number,
  progression = 'L1'
): Exercise => {
  const lvls = progressionLevels(progression);
  const execution =
    lvls.length === 1
      ? pe.levels[lvls[0]]
      : `${pe.levels[lvls[0]]}; по мере освоения — ${pe.levels[lvls[lvls.length - 1]]}`;
  return {
    id: 'y1-' + pe.id,
    name: pe.name,
    category: CATEGORY_MAP[pe.category] ?? 'ofp',
    stage: 'beginner',
    description:
      `Выполнение для всей группы: ${execution}.` +
      (pe.prerequisites.length
        ? `\n\nПредварительно освоить: ${pe.prerequisites.join(', ')}`
        : ''),
    goal: `Связь с кумитэ: ${pe.kumite_link}. Критерии качества: ${pe.quality_criteria.join(', ')}.`,
    durationMin,
    difficulty: 'beginner',
    commonMistakes: pe.common_errors.join('; '),
    simplifiedVariant: pe.levels.L1,
    advancedVariant: pe.levels.L3,
    videos: [],
  };
};

const rand = () => Math.random().toString(36).slice(2, 8);

/**
 * Копирует тренировку стандартного плана в личный план тренера:
 * возвращает упражнения для добавления в библиотеку и готовую тренировку.
 */
export const convertPlanWorkout = (
  pw: PlanWorkout,
  date: string,
  time: string
): { exercises: Exercise[]; workout: Workout } => {
  const exMap = new Map<string, Exercise>();
  const blocks: WorkoutBlock[] = pw.blocks.map((b, bi) => {
    const ids = b.exercise_ids ?? [];
    const per = ids.length ? Math.max(1, Math.round(b.duration_min / ids.length)) : b.duration_min;
    return {
      id: `wb-y1-${pw.id}-${bi}-${rand()}`,
      name:
        (PLAN_BLOCK_LABELS[b.type] ?? b.type) +
        (b.mandatory ? ' (обязательно)' : ''),
      durationMin: b.duration_min,
      exercises: ids.map((eid, ei) => {
        const pe = planExerciseById[eid];
        if (pe && !exMap.has(eid)) exMap.set(eid, planExerciseToExercise(pe, per, pw.progression));
        return {
          id: `we-y1-${pw.id}-${bi}-${ei}-${rand()}`,
          exerciseId: 'y1-' + eid,
          durationMin: per,
          notes: b.order ?? b.notes,
        };
      }),
    };
  });

  return {
    exercises: Array.from(exMap.values()),
    workout: {
      id: `wk-y1-${pw.id}-${rand()}`,
      name: `Неделя ${pw.week} · Занятие ${pw.session} — ${pw.theme}`,
      theme: pw.theme,
      goal: `Стандартный план, раздел 1 (${pw.phase}). Уровень группы: ${pw.progression}. ${pw.coach_note}`,
      date,
      time,
      stage: 'beginner',
      durationMin: pw.duration_min,
      blocks,
      status: 'planned',
    },
  };
};
