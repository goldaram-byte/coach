// User & Auth
export interface Coach {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  city?: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

// Training Structure
export interface TrainingStage {
  id: string;
  name: string;
  description?: string;
  level: number;
  color: string;
}

export interface TrainingProgram {
  id: string;
  coach_id: string;
  club_id?: string;
  training_stage_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingYear {
  id: string;
  training_program_id: string;
  year_number: number;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingPeriod {
  id: string;
  training_year_id: string;
  name: string;
  period_type: 'preparation' | 'competitive' | 'recovery';
  start_date: string;
  end_date: string;
  goals?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingMonth {
  id: string;
  training_period_id: string;
  month_number: number;
  month_name: string;
  start_date: string;
  end_date: string;
  goals?: string;
  main_directions?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingWeek {
  id: string;
  training_month_id: string;
  week_number: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingDay {
  id: string;
  training_week_id: string;
  day_of_week: string;
  date?: string;
  is_training_day: boolean;
  created_at: string;
  updated_at: string;
}

// Exercises
export interface ExerciseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Exercise {
  id: string;
  coach_id: string;
  category_id: string;
  name: string;
  description?: string;
  goals?: string;
  target_age_min?: number;
  target_age_max?: number;
  equipment?: string;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  training_stage_id?: string;
  common_mistakes?: string;
  simplified_variant?: string;
  advanced_variant?: string;
  created_at: string;
  updated_at: string;
  videos?: ExerciseVideo[];
}

export interface ExerciseVideo {
  id: string;
  exercise_id: string;
  video_url: string;
  title?: string;
  description?: string;
  duration_seconds?: number;
  display_order: number;
}

// Workouts
export interface WorkoutBlock {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
}

export interface Workout {
  id: string;
  training_day_id: string;
  coach_id: string;
  name: string;
  description?: string;
  goal?: string;
  group_id?: string;
  duration_minutes?: number;
  theme?: string;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  block_id: string;
  exercise_id: string;
  display_order: number;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  notes?: string;
  exercise?: Exercise;
  block?: WorkoutBlock;
}

// Athletes
export interface Athlete {
  id: string;
  coach_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  category?: string;
  experience_years?: number;
  sport_rank?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  coach_id: string;
  name: string;
  age_min?: number;
  age_max?: number;
  training_stage_id?: string;
  athlete_count?: number;
  schedule?: string;
  program_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AthleteGroup {
  id: string;
  group_id: string;
  athlete_id: string;
  joined_at: string;
}

// Competitions
export interface Competition {
  id: string;
  coach_id: string;
  name: string;
  date: string;
  location?: string;
  category?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CompetitionAthlete {
  id: string;
  competition_id: string;
  athlete_id: string;
  category?: string;
  place?: number;
}

// Progress
export interface AthleteProgress {
  id: string;
  athlete_id: string;
  metric_type: string;
  value: number;
  date: string;
  notes?: string;
}

export interface AthleteProgram {
  id: string;
  athlete_id: string;
  program_id: string;
  assigned_date: string;
}

// Templates
export interface WorkoutTemplate {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  template_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}
