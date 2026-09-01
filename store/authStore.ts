'use client';

import { create } from 'zustand';
import { api, ApiError, ApiUser } from '@/lib/api';
import { useAppStore } from './appStore';
import { seedSharedBlocks } from '@/lib/seed';

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
  'blockTemplates',
  'hiddenSharedBlockIds',
] as const;

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let sharedTimer: ReturnType<typeof setTimeout> | null = null;
let planVideosTimer: ReturnType<typeof setTimeout> | null = null;
let syncStarted = false;
let suppressSync = false;
let lastShared: unknown = null;
let lastPlanVideos: unknown = null;

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

const pushShared = async () => {
  const auth = useAuthStore.getState();
  if (auth.status !== 'authed' || !auth.user?.isAdmin) return;
  try {
    await api.saveShared(JSON.stringify(useAppStore.getState().sharedBlocks));
  } catch {
    useAuthStore.setState({ saveStatus: 'error' });
  }
};

const pushPlanVideos = async () => {
  const auth = useAuthStore.getState();
  if (auth.status !== 'authed' || !auth.user?.isAdmin) return;
  try {
    await api.saveShared(JSON.stringify(useAppStore.getState().planVideos), 'plan_videos');
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

  // Общие (базовые) блоки владельца — единые для всех тренеров
  try {
    const shared = await api.getShared();
    suppressSync = true;
    if (shared.data) {
      useAppStore.setState({ sharedBlocks: JSON.parse(shared.data) });
    } else {
      // На сервере ещё нет базовых блоков — показываем стартовый набор;
      // владелец сразу сохраняет его на сервер.
      useAppStore.setState({ sharedBlocks: seedSharedBlocks });
      if (useAuthStore.getState().user?.isAdmin) await pushShared();
    }
    suppressSync = false;
  } catch {
    suppressSync = false;
  }
  lastShared = useAppStore.getState().sharedBlocks;

  // Видео стандартного плана — единые для всех тренеров
  try {
    const videos = await api.getShared('plan_videos');
    if (videos.data) {
      suppressSync = true;
      useAppStore.setState({ planVideos: JSON.parse(videos.data) });
      suppressSync = false;
    }
  } catch {
    suppressSync = false;
  }
  lastPlanVideos = useAppStore.getState().planVideos;
};

const startSync = () => {
  if (syncStarted) return;
  syncStarted = true;
  useAppStore.subscribe((s) => {
    if (suppressSync) {
      lastShared = s.sharedBlocks;
      lastPlanVideos = s.planVideos;
      return;
    }
    if (useAuthStore.getState().status !== 'authed') return;

    // Базовые блоки изменились — владелец публикует их для всех
    if (s.sharedBlocks !== lastShared) {
      lastShared = s.sharedBlocks;
      if (useAuthStore.getState().user?.isAdmin) {
        if (sharedTimer) clearTimeout(sharedTimer);
        sharedTimer = setTimeout(pushShared, 1000);
      }
    }

    // Видео плана изменились — владелец публикует их для всех
    if (s.planVideos !== lastPlanVideos) {
      lastPlanVideos = s.planVideos;
      if (useAuthStore.getState().user?.isAdmin) {
        if (planVideosTimer) clearTimeout(planVideosTimer);
        planVideosTimer = setTimeout(pushPlanVideos, 1000);
      }
    }

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
