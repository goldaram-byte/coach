'use client';

import { create } from 'zustand';
import { api, ApiError, ApiUser } from '@/lib/api';
import { useAppStore } from './appStore';

export type AuthStatus =
  | 'loading' // первичная проверка сессии
  | 'authed' // вошёл, доступ подтверждён
  | 'pending' // вошёл, но ждёт подтверждения владельцем
  | 'guest' // не вошёл
  | 'offline'; // API недоступен — автономный режим (localStorage)

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AuthState {
  status: AuthStatus;
  user: ApiUser | null;
  saveStatus: SaveStatus;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const DOMAIN_KEYS = [
  'exercises',
  'workouts',
  'groups',
  'athletes',
  'competitions',
  'programs',
] as const;

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncStarted = false;
let suppressSync = false;

const snapshot = (): string => {
  const s = useAppStore.getState();
  const data: Record<string, unknown> = {};
  for (const key of DOMAIN_KEYS) data[key] = s[key];
  return JSON.stringify(data);
};

const pushState = async () => {
  const auth = useAuthStore.getState();
  if (auth.status !== 'authed') return;
  try {
    useAuthStore.setState({ saveStatus: 'saving' });
    await api.saveState(snapshot());
    useAuthStore.setState({ saveStatus: 'saved' });
  } catch {
    useAuthStore.setState({ saveStatus: 'error' });
  }
};

const pullState = async () => {
  const res = await api.getState();
  if (res.data) {
    try {
      const parsed = JSON.parse(res.data);
      suppressSync = true;
      useAppStore.setState(parsed);
      suppressSync = false;
    } catch {
      // повреждённое состояние на сервере — оставляем локальное и перезаписываем
      await pushState();
    }
  } else {
    // на сервере пусто (первый вход) — сохраняем текущее (демо) состояние
    await pushState();
  }
};

const startSync = () => {
  if (syncStarted) return;
  syncStarted = true;
  useAppStore.subscribe(() => {
    if (suppressSync) return;
    if (useAuthStore.getState().status !== 'authed') return;
    if (syncTimer) clearTimeout(syncTimer);
    useAuthStore.setState({ saveStatus: 'saving' });
    syncTimer = setTimeout(pushState, 1500);
  });
};

const enterAuthed = async (user: ApiUser) => {
  if (user.status === 'active') {
    useAuthStore.setState({ status: 'authed', user });
    await pullState();
    startSync();
  } else {
    useAuthStore.setState({ status: 'pending', user });
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  user: null,
  saveStatus: 'idle',

  init: async () => {
    if (get().status !== 'loading') return;
    try {
      const { user } = await api.me();
      await enterAuthed(user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        set({ status: 'guest', user: null });
      } else {
        // API нет (локальная разработка / сервер без PHP) — автономный режим
        set({ status: 'offline', user: null });
      }
    }
  },

  login: async (email, password) => {
    const { user } = await api.login(email, password);
    await enterAuthed(user);
  },

  register: async (name, email, password) => {
    const { user } = await api.register(name, email, password);
    await enterAuthed(user);
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // игнорируем сетевые ошибки при выходе
    }
    set({ status: 'guest', user: null, saveStatus: 'idle' });
  },

  refreshMe: async () => {
    try {
      const { user } = await api.me();
      await enterAuthed(user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) set({ status: 'guest', user: null });
    }
  },
}));
