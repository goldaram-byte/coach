import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using mock/demo mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Watch auth changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      callback(session.user);
    } else {
      callback(null);
    }
  });

  return data?.subscription.unsubscribe;
};

// Database helpers
export const db = {
  // Coaches
  getCoach: async (userId: string) => {
    return await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  createCoach: async (data: any) => {
    return await supabase
      .from('coaches')
      .insert([data])
      .select()
      .single();
  },

  // Training Programs
  getPrograms: async (coachId: string) => {
    return await supabase
      .from('training_programs')
      .select('*, training_stages(*)')
      .eq('coach_id', coachId);
  },

  getProgram: async (programId: string) => {
    return await supabase
      .from('training_programs')
      .select('*, training_stages(*)')
      .eq('id', programId)
      .single();
  },

  createProgram: async (data: any) => {
    return await supabase
      .from('training_programs')
      .insert([data])
      .select()
      .single();
  },

  // Training Years
  getYears: async (programId: string) => {
    return await supabase
      .from('training_years')
      .select('*')
      .eq('training_program_id', programId)
      .order('year_number');
  },

  // Training Periods
  getPeriods: async (yearId: string) => {
    return await supabase
      .from('training_periods')
      .select('*')
      .eq('training_year_id', yearId)
      .order('start_date');
  },

  // Training Months
  getMonths: async (periodId: string) => {
    return await supabase
      .from('training_months')
      .select('*')
      .eq('training_period_id', periodId)
      .order('month_number');
  },

  // Training Weeks
  getWeeks: async (monthId: string) => {
    return await supabase
      .from('training_weeks')
      .select('*')
      .eq('training_month_id', monthId)
      .order('week_number');
  },

  // Training Days
  getDays: async (weekId: string) => {
    return await supabase
      .from('training_days')
      .select('*')
      .eq('training_week_id', weekId)
      .order('date');
  },

  // Workouts
  getWorkout: async (workoutId: string) => {
    return await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises(
          *,
          exercises(*, exercise_videos(*)),
          workout_blocks(*)
        )
      `)
      .eq('id', workoutId)
      .single();
  },

  getWorkoutsByDay: async (dayId: string) => {
    return await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises(
          *,
          exercises(*),
          workout_blocks(*)
        )
      `)
      .eq('training_day_id', dayId);
  },

  createWorkout: async (data: any) => {
    return await supabase
      .from('workouts')
      .insert([data])
      .select()
      .single();
  },

  // Exercises
  getExercises: async (coachId: string) => {
    return await supabase
      .from('exercises')
      .select('*, exercise_videos(*), exercise_categories(*)')
      .eq('coach_id', coachId);
  },

  getExercise: async (exerciseId: string) => {
    return await supabase
      .from('exercises')
      .select('*, exercise_videos(*), exercise_categories(*)')
      .eq('id', exerciseId)
      .single();
  },

  createExercise: async (data: any) => {
    return await supabase
      .from('exercises')
      .insert([data])
      .select()
      .single();
  },

  // Exercise Categories
  getCategories: async () => {
    return await supabase
      .from('exercise_categories')
      .select('*');
  },

  // Exercise Videos
  uploadVideo: async (file: File, exerciseId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${exerciseId}/${Date.now()}.${fileExt}`;

    return await supabase.storage
      .from('exercise-videos')
      .upload(fileName, file);
  },

  getVideoUrl: (path: string) => {
    return supabase.storage
      .from('exercise-videos')
      .getPublicUrl(path).data.publicUrl;
  },

  // Training Stages
  getStages: async () => {
    return await supabase
      .from('training_stages')
      .select('*')
      .order('level');
  },
};
