import { CategoryId, StageId, Difficulty, PeriodType } from './types';

export const STAGE_LABELS: Record<StageId, string> = {
  beginner: 'Начальная подготовка',
  intermediate: 'Спортивная группа',
  advanced: 'Спортивное совершенствование',
};

export const STAGE_BADGE: Record<StageId, string> = {
  beginner: 'badge-green',
  intermediate: 'badge-amber',
  advanced: 'badge-red',
};

export const STAGE_DOT: Record<StageId, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-red-500',
};

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  kumite: 'Кумитэ',
  kata: 'Ката',
  ofp: 'ОФП',
  sfp: 'СФП',
  tactics: 'Тактика',
  psychology: 'Психология',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};

export const PERIOD_LABELS: Record<PeriodType, string> = {
  preparation: 'Подготовительный',
  competitive: 'Соревновательный',
  recovery: 'Восстановительный',
};

export const PERIOD_BADGE: Record<PeriodType, string> = {
  preparation: 'badge-blue',
  competitive: 'badge-orange',
  recovery: 'badge-green',
};

export const WEEKDAY_LABELS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

export const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MONTH_LABELS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const SKILL_LABELS: Record<string, string> = {
  speed: 'Скорость',
  reaction: 'Реакция',
  technique: 'Техника',
  tactics: 'Тактика',
  endurance: 'Выносливость',
  strength: 'Сила',
  flexibility: 'Гибкость',
  psychology: 'Психология',
};

export const formatDateRu = (isoDate: string): string => {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

export const formatDateFullRu = (isoDate: string): string => {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const weekdayOfISO = (isoDate: string): number => {
  const d = new Date(isoDate + 'T00:00:00');
  return (d.getDay() + 6) % 7; // 0 = Monday
};

export const calcAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};
