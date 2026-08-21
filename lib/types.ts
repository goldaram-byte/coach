// ===== Core domain types (client data layer) =====

export type StageId = 'beginner' | 'intermediate' | 'advanced';
export type CategoryId = 'kumite' | 'kata' | 'ofp' | 'sfp' | 'tactics' | 'psychology';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type PeriodType = 'preparation' | 'competitive' | 'recovery';

export interface ExerciseVideo {
  id: string;
  title: string;
  url: string; // external URL or object URL
}

export interface Exercise {
  id: string;
  name: string;
  category: CategoryId;
  stage: StageId;
  description: string;
  goal: string;
  equipment?: string;
  durationMin: number;
  sets?: number;
  reps?: number;
  difficulty: Difficulty;
  ageMin?: number;
  ageMax?: number;
  commonMistakes?: string;
  simplifiedVariant?: string;
  advancedVariant?: string;
  videos: ExerciseVideo[];
  custom?: boolean; // created by the coach
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  durationMin?: number;
  sets?: number;
  reps?: number;
  notes?: string;
}

export interface WorkoutBlock {
  id: string;
  name: string;
  durationMin: number;
  exercises: WorkoutExercise[];
}

export type WorkoutStatus = 'planned' | 'completed';

export interface Workout {
  id: string;
  name: string;
  theme: string;
  goal: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  groupId?: string;
  stage: StageId;
  durationMin: number;
  blocks: WorkoutBlock[];
  status: WorkoutStatus;
  completedNote?: string;
  completedExerciseIds?: string[]; // WorkoutExercise ids marked done
}

export interface TrainingDayPlan {
  id: string;
  weekday: number; // 0 = Monday … 6 = Sunday
  focus: string; // e.g. "Координация + техника"
  rest: boolean;
}

export interface TrainingWeekPlan {
  id: string;
  number: number;
  theme: string;
  days: TrainingDayPlan[];
}

export interface TrainingMonthPlan {
  id: string;
  monthNumber: number; // 1-12
  name: string;
  goals: string[];
  directions: string;
  workoutsPlanned: number;
  progress: number; // 0-100
  weeks: TrainingWeekPlan[];
}

export interface TrainingPeriodPlan {
  id: string;
  name: string;
  type: PeriodType;
  months: TrainingMonthPlan[];
}

export interface TrainingYearPlan {
  id: string;
  number: number;
  goals: string[];
  periods: TrainingPeriodPlan[];
}

export interface Program {
  id: string;
  name: string;
  stage: StageId;
  description: string;
  stageTasks: string[];
  years: TrainingYearPlan[];
}

export interface GroupScheduleSlot {
  weekday: number; // 0 = Monday
  time: string;
}

export interface Group {
  id: string;
  name: string;
  ageMin: number;
  ageMax: number;
  stage: StageId;
  schedule: GroupScheduleSlot[];
  programId?: string;
}

export interface AthleteSkills {
  speed: number;
  reaction: number;
  technique: number;
  tactics: number;
  endurance: number;
  strength: number;
  flexibility: number;
  psychology: number;
}

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  weightKg?: number;
  category?: string;
  experienceYears?: number;
  rank?: string;
  groupId?: string;
  skills: AthleteSkills;
  goals: string[];
  notes?: string;
}

export interface CompetitionResult {
  athleteId: string;
  place?: number;
  fights?: number;
  wins?: number;
  note?: string;
}

export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  athleteIds: string[];
  results: CompetitionResult[];
}
