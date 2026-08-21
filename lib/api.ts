// Тонкий клиент для PHP-API на том же домене.
// В офлайн-режиме (нет PHP, например при локальной разработке
// через простой файловый сервер) запросы падают — это штатно
// обрабатывается в authStore.

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body: any = null;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Пришёл не JSON (например, HTML 404 от статического сервера) —
    // значит, API недоступен.
    throw new ApiError('api_unavailable', res.status);
  }

  if (!res.ok) {
    throw new ApiError(body?.error ?? 'unknown_error', res.status);
  }
  return body as T;
}

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  status: 'pending' | 'active' | 'blocked';
}

export const api = {
  me: () => request<{ user: ApiUser }>('auth.php?action=me'),

  login: (email: string, password: string) =>
    request<{ user: ApiUser }>('auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<{ user: ApiUser }>('auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () => request<{ ok: boolean }>('auth.php?action=logout'),

  getState: () => request<{ data: string | null; updatedAt: string | null }>('state.php'),

  saveState: (data: string) =>
    request<{ ok: boolean }>('state.php', {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),

  adminUsers: () => request<{ users: (ApiUser & { createdAt: string })[] }>('admin.php?action=users'),

  adminSetStatus: (id: number, status: 'active' | 'pending' | 'blocked') =>
    request<{ ok: boolean }>('admin.php?action=set_status', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    }),
};

export const API_ERROR_MESSAGES: Record<string, string> = {
  api_unavailable: 'Сервер недоступен. Приложение работает в автономном режиме.',
  db_not_configured: 'База данных не настроена. Заполните api/config.php на хостинге.',
  db_connection_failed: 'Не удалось подключиться к базе данных. Проверьте api/config.php.',
  invalid_credentials: 'Неверный email или пароль.',
  blocked: 'Доступ к вашему аккаунту закрыт владельцем.',
  not_approved: 'Ваш аккаунт ещё не подтверждён владельцем.',
  email_taken: 'Этот email уже зарегистрирован.',
  invalid_email: 'Некорректный email.',
  password_too_short: 'Пароль должен быть не короче 6 символов.',
  missing_fields: 'Заполните все поля.',
  unauthorized: 'Требуется вход.',
};

export const apiErrorText = (e: unknown): string => {
  if (e instanceof ApiError) return API_ERROR_MESSAGES[e.code] ?? `Ошибка: ${e.code}`;
  return 'Что-то пошло не так. Попробуйте ещё раз.';
};
