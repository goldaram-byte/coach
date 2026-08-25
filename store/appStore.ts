'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Exercise,
  Workout,
  Group,
  Athlete,
  Competition,
  Program,
  WorkoutBlock,
  BlockTemplate,
} from '@/lib/types';
import {
  seedExercises,
  seedWorkouts,
  seedGroups,
  seedAthletes,
  seedCompetitions,
  seedPrograms,
  seedSharedBlocks,
} from '@/lib/seed';

export const genId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

interface AppState {
  exercises: Exercise[];
  workouts: Workout[];
  groups: Group[];
  athletes: Athlete[];
  competitions: Competition[];
  programs: Program[];
  /** Базовые блоки владельца — видны всем тренерам */
  sharedBlocks: BlockTemplate[];
  /** Личные блоки текущего тренера */
  blockTemplates: BlockTemplate[];
  /** Базовые блоки, скрытые текущим тренером */
  hiddenSharedBlockIds: string[];

  // Block templates
  setSharedBlocks: (blocks: BlockTemplate[]) => void;
  addSharedBlock: (b: BlockTemplate) => void;
  updateSharedBlock: (id: string, patch: Partial<BlockTemplate>) => void;
  deleteSharedBlock: (id: string) => void;
  addBlockTemplate: (b: BlockTemplate) => void;
  updateBlockTemplate: (id: string, patch: Partial<BlockTemplate>) => void;
  deleteBlockTemplate: (id: string) => void;
  toggleHiddenSharedBlock: (id: string) => void;
  upsertExercises: (exs: Exercise[]) => void;

  // Exercises
  addExercise: (ex: Exercise) => void;
  updateExercise: (id: string, patch: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  // Workouts
  addWorkout: (w: Workout) => void;
  updateWorkout: (id: string, patch: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  duplicateWorkout: (id: string, newDate: string) => string | null;
  toggleExerciseDone: (workoutId: string, workoutExerciseId: string) => void;
  completeWorkout: (workoutId: string, note: string) => void;

  // Groups
  addGroup: (g: Group) => void;
  updateGroup: (id: string, patch: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  // Athletes
  addAthlete: (a: Athlete) => void;
  updateAthlete: (id: string, patch: Partial<Athlete>) => void;
  deleteAthlete: (id: string) => void;

  // Competitions
  addCompetition: (c: Competition) => void;
  updateCompetition: (id: string, patch: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;

  resetDemo: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      exercises: seedExercises,
      workouts: seedWorkouts,
      groups: seedGroups,
      athletes: seedAthletes,
      competitions: seedCompetitions,
      programs: seedPrograms,
      sharedBlocks: seedSharedBlocks,
      blockTemplates: [],
      hiddenSharedBlockIds: [],

      setSharedBlocks: (blocks) => set({ sharedBlocks: blocks }),
      addSharedBlock: (b) => set((s) => ({ sharedBlocks: [b, ...s.sharedBlocks] })),
      updateSharedBlock: (id, patch) =>
        set((s) => ({
          sharedBlocks: s.sharedBlocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteSharedBlock: (id) =>
        set((s) => ({ sharedBlocks: s.sharedBlocks.filter((b) => b.id !== id) })),

      addBlockTemplate: (b) => set((s) => ({ blockTemplates: [b, ...s.blockTemplates] })),
      updateBlockTemplate: (id, patch) =>
        set((s) => ({
          blockTemplates: s.blockTemplates.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteBlockTemplate: (id) =>
        set((s) => ({ blockTemplates: s.blockTemplates.filter((b) => b.id !== id) })),

      toggleHiddenSharedBlock: (id) =>
        set((s) => {
          const hidden = new Set(s.hiddenSharedBlockIds);
          if (hidden.has(id)) hidden.delete(id);
          else hidden.add(id);
          return { hiddenSharedBlockIds: Array.from(hidden) };
        }),

      upsertExercises: (exs) =>
        set((s) => {
          const known = new Set(s.exercises.map((e) => e.id));
          const fresh = exs.filter((e) => !known.has(e.id));
          return fresh.length ? { exercises: [...s.exercises, ...fresh] } : {};
        }),

      addExercise: (ex) => set((s) => ({ exercises: [ex, ...s.exercises] })),
      updateExercise: (id, patch) =>
        set((s) => ({
          exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      deleteExercise: (id) =>
        set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) })),

      addWorkout: (w) => set((s) => ({ workouts: [w, ...s.workouts] })),
      updateWorkout: (id, patch) =>
        set((s) => ({
          workouts: s.workouts.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
      deleteWorkout: (id) =>
        set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      duplicateWorkout: (id, newDate) => {
        const src = get().workouts.find((w) => w.id === id);
        if (!src) return null;
        const newId = genId('wk');
        const blocks: WorkoutBlock[] = src.blocks.map((b, bi) => ({
          ...b,
          id: `${newId}-b${bi}`,
          exercises: b.exercises.map((e, ei) => ({ ...e, id: `${newId}-b${bi}-e${ei}` })),
        }));
        const copy: Workout = {
          ...src,
          id: newId,
          date: newDate,
          status: 'planned',
          completedNote: undefined,
          completedExerciseIds: [],
          blocks,
        };
        set((s) => ({ workouts: [copy, ...s.workouts] }));
        return newId;
      },

      toggleExerciseDone: (workoutId, workoutExerciseId) =>
        set((s) => ({
          workouts: s.workouts.map((w) => {
            if (w.id !== workoutId) return w;
            const done = new Set(w.completedExerciseIds ?? []);
            if (done.has(workoutExerciseId)) done.delete(workoutExerciseId);
            else done.add(workoutExerciseId);
            return { ...w, completedExerciseIds: Array.from(done) };
          }),
        })),

      completeWorkout: (workoutId, note) =>
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId ? { ...w, status: 'completed', completedNote: note } : w
          ),
        })),

      addGroup: (g) => set((s) => ({ groups: [...s.groups, g] })),
      updateGroup: (id, patch) =>
        set((s) => ({
          groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      deleteGroup: (id) => set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),

      addAthlete: (a) => set((s) => ({ athletes: [...s.athletes, a] })),
      updateAthlete: (id, patch) =>
        set((s) => ({
          athletes: s.athletes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteAthlete: (id) =>
        set((s) => ({ athletes: s.athletes.filter((a) => a.id !== id) })),

      addCompetition: (c) => set((s) => ({ competitions: [...s.competitions, c] })),
      updateCompetition: (id, patch) =>
        set((s) => ({
          competitions: s.competitions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCompetition: (id) =>
        set((s) => ({ competitions: s.competitions.filter((c) => c.id !== id) })),

      resetDemo: () =>
        set({
          exercises: seedExercises,
          workouts: seedWorkouts,
          groups: seedGroups,
          athletes: seedAthletes,
          competitions: seedCompetitions,
          programs: seedPrograms,
          sharedBlocks: seedSharedBlocks,
          blockTemplates: [],
          hiddenSharedBlockIds: [],
        }),
    }),
    {
      name: 'karate-wkf-coach-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
