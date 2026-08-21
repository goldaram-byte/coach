import { create } from 'zustand';
import { Coach } from '@/lib/types';

interface AuthState {
  user: any | null;
  coach: Coach | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  setCoach: (coach: Coach) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  coach: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setCoach: (coach) =>
    set({
      coach,
    }),

  logout: () =>
    set({
      user: null,
      coach: null,
      isAuthenticated: false,
    }),
}));
