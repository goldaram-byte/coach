-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (from Supabase Auth)
-- Note: Supabase automatically creates auth.users table

-- Coaches
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Stages (Beginner, Intermediate, Advanced)
CREATE TABLE training_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  level INTEGER NOT NULL, -- 1, 2, 3
  color TEXT DEFAULT '#10b981', -- hex color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Programs
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  training_stage_id UUID NOT NULL REFERENCES training_stages(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Years
CREATE TABLE training_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  year_number INTEGER NOT NULL, -- 1, 2, 3, etc.
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Periods (Macrocycles)
CREATE TABLE training_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_year_id UUID NOT NULL REFERENCES training_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Preparation, Competitive, Recovery
  period_type TEXT NOT NULL, -- 'preparation', 'competitive', 'recovery'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Months
CREATE TABLE training_months (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_period_id UUID NOT NULL REFERENCES training_periods(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL, -- 1-12
  month_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goals TEXT,
  main_directions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Weeks
CREATE TABLE training_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_month_id UUID NOT NULL REFERENCES training_months(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Days
CREATE TABLE training_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_week_id UUID NOT NULL REFERENCES training_weeks(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  date DATE,
  is_training_day BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise Categories
CREATE TABLE exercise_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES exercise_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  goals TEXT,
  target_age_min INTEGER,
  target_age_max INTEGER,
  equipment TEXT,
  duration_minutes INTEGER,
  sets INTEGER,
  reps INTEGER,
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  training_stage_id UUID REFERENCES training_stages(id),
  common_mistakes TEXT,
  simplified_variant TEXT,
  advanced_variant TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise Videos
CREATE TABLE exercise_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Blocks (parts of a workout)
CREATE TABLE workout_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Warm-up', 'Technique', 'Kumite', etc.
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_day_id UUID NOT NULL REFERENCES training_days(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  group_id UUID, -- for future: group assignment
  duration_minutes INTEGER,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Exercises (exercises in blocks within workouts)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES workout_blocks(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  display_order INTEGER,
  duration_minutes INTEGER,
  sets INTEGER,
  reps INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athletes
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  weight_kg NUMERIC(5, 2),
  height_cm INTEGER,
  category TEXT,
  experience_years INTEGER,
  sport_rank TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Groups
CREATE TABLE athlete_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  training_stage_id UUID REFERENCES training_stages(id),
  athlete_count INTEGER DEFAULT 0,
  schedule TEXT, -- JSON or text
  program_id UUID REFERENCES training_programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitions
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competition Athletes
CREATE TABLE competition_athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  category TEXT,
  place INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Progress
CREATE TABLE athlete_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'speed', 'technique', 'endurance', etc.
  value NUMERIC(5, 2),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Programs (assignments)
CREATE TABLE athlete_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Templates
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB, -- serialized workout structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_clubs_coach_id ON clubs(coach_id);
CREATE INDEX idx_training_programs_coach_id ON training_programs(coach_id);
CREATE INDEX idx_training_programs_stage_id ON training_programs(training_stage_id);
CREATE INDEX idx_training_years_program_id ON training_years(training_program_id);
CREATE INDEX idx_training_periods_year_id ON training_periods(training_year_id);
CREATE INDEX idx_training_months_period_id ON training_months(training_period_id);
CREATE INDEX idx_training_weeks_month_id ON training_weeks(training_month_id);
CREATE INDEX idx_training_days_week_id ON training_days(training_week_id);
CREATE INDEX idx_exercises_coach_id ON exercises(coach_id);
CREATE INDEX idx_exercises_category_id ON exercises(category_id);
CREATE INDEX idx_exercise_videos_exercise_id ON exercise_videos(exercise_id);
CREATE INDEX idx_workouts_training_day_id ON workouts(training_day_id);
CREATE INDEX idx_workouts_coach_id ON workouts(coach_id);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_athletes_coach_id ON athletes(coach_id);
CREATE INDEX idx_athlete_groups_group_id ON athlete_groups(group_id);
CREATE INDEX idx_athlete_groups_athlete_id ON athlete_groups(athlete_id);
CREATE INDEX idx_groups_coach_id ON groups(coach_id);
CREATE INDEX idx_competitions_coach_id ON competitions(coach_id);
CREATE INDEX idx_competition_athletes_competition_id ON competition_athletes(competition_id);
CREATE INDEX idx_athlete_progress_athlete_id ON athlete_progress(athlete_id);
CREATE INDEX idx_athlete_programs_athlete_id ON athlete_programs(athlete_id);
CREATE INDEX idx_workout_templates_coach_id ON workout_templates(coach_id);
