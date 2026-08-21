export const TRAINING_STAGES = {
  BEGINNER: {
    id: 'beginner',
    name: 'Начальная подготовка',
    label: 'Beginner',
    level: 1,
    color: '#10b981',
    description: 'Создание физической, технической и координационной базы для дальнейшего развития спортсмена.',
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Спортивная группа',
    label: 'Intermediate',
    level: 2,
    color: '#f59e0b',
    description: 'Переход от общего обучения к специализированной спортивной подготовке и соревновательной деятельности.',
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Спортивное совершенствование',
    label: 'Advanced',
    level: 3,
    color: '#ef4444',
    description: 'Подготовка спортсмена к высоким спортивным результатам.',
  },
};

export const EXERCISE_CATEGORIES = {
  KUMITE: { id: 'kumite', name: 'Кумитэ', label: 'Kumite' },
  KATA: { id: 'kata', name: 'Ката', label: 'Kata' },
  OFP: { id: 'ofp', name: 'ОФП', label: 'General Physical Training' },
  SFP: { id: 'sfp', name: 'СФП', label: 'Special Physical Training' },
  TACTICS: { id: 'tactics', name: 'Тактика', label: 'Tactics' },
  PSYCHOLOGY: { id: 'psychology', name: 'Психология', label: 'Psychology' },
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const WORKOUT_BLOCKS = {
  WARMUP: 'Разминка',
  LEG_WORK: 'Работа ног',
  TECHNIQUE: 'Техническая подготовка',
  PAIR_WORK: 'Работа в парах',
  SFP: 'СФП',
  COOLDOWN: 'Заминка',
  KUMITE: 'Кумитэ',
  KATA: 'Ката',
  OFP: 'ОФП',
};

export const DAYS_OF_WEEK = {
  MONDAY: { en: 'Monday', ru: 'Понедельник' },
  TUESDAY: { en: 'Tuesday', ru: 'Вторник' },
  WEDNESDAY: { en: 'Wednesday', ru: 'Среда' },
  THURSDAY: { en: 'Thursday', ru: 'Четверг' },
  FRIDAY: { en: 'Friday', ru: 'Пятница' },
  SATURDAY: { en: 'Saturday', ru: 'Суббота' },
  SUNDAY: { en: 'Sunday', ru: 'Воскресенье' },
};

export const PERIOD_TYPES = {
  PREPARATION: { id: 'preparation', name: 'Подготовительный период', label: 'Preparation' },
  COMPETITIVE: { id: 'competitive', name: 'Соревновательный период', label: 'Competitive' },
  RECOVERY: { id: 'recovery', name: 'Восстановительный период', label: 'Recovery' },
};

export const MONTHS = [
  { number: 1, name: 'January', ru: 'Январь' },
  { number: 2, name: 'February', ru: 'Февраль' },
  { number: 3, name: 'March', ru: 'Март' },
  { number: 4, name: 'April', ru: 'Апрель' },
  { number: 5, name: 'May', ru: 'Май' },
  { number: 6, name: 'June', ru: 'Июнь' },
  { number: 7, name: 'July', ru: 'Июль' },
  { number: 8, name: 'August', ru: 'Август' },
  { number: 9, name: 'September', ru: 'Сентябрь' },
  { number: 10, name: 'October', ru: 'Октябрь' },
  { number: 11, name: 'November', ru: 'Ноябрь' },
  { number: 12, name: 'December', ru: 'Декабрь' },
];

export const BEGINNERS_YEARLY_PLAN = {
  SEPTEMBER: {
    goals: ['Адаптация к тренировкам', 'Дисциплина', 'Координация', 'Базовые стойки'],
    mainDirections: 'Физическая подготовка, координация, базовая техника',
  },
  OCTOBER: {
    goals: ['Базовые передвижения', 'Удары руками', 'Гибкость', 'Реакция'],
    mainDirections: 'Техническая подготовка, работа ног',
  },
  NOVEMBER: {
    goals: ['Удары ногами', 'Работа на дистанции', 'Базовое кумитэ'],
    mainDirections: 'Техническая подготовка, кумитэ',
  },
  DECEMBER: {
    goals: ['Базовые блоки', 'Стабильность', 'Баланс'],
    mainDirections: 'Техническая подготовка, защита',
  },
  JANUARY: {
    goals: ['Повторение базовых техник', 'Выносливость', 'ОФП'],
    mainDirections: 'Общая физическая подготовка',
  },
  FEBRUARY: {
    goals: ['Ката базовые элементы', 'Координация', 'Ритм'],
    mainDirections: 'Ката, координация',
  },
  MARCH: {
    goals: ['Совершенствование техники', 'Работа в парах', 'Серийные движения'],
    mainDirections: 'Техническая подготовка, кумитэ',
  },
  APRIL: {
    goals: ['Игровые упражнения', 'Соревновательная подготовка'],
    mainDirections: 'Кумитэ, игровые упражнения',
  },
  MAY: {
    goals: ['Тестирование навыков', 'Контроль техники'],
    mainDirections: 'Общее совершенствование',
  },
  JUNE: {
    goals: ['Период активного отдыха', 'Игровая подготовка'],
    mainDirections: 'Восстановление и игровая подготовка',
  },
  JULY: {
    goals: ['Летний сбор', 'Интенсивная подготовка'],
    mainDirections: 'Техническая и физическая подготовка',
  },
  AUGUST: {
    goals: ['Подготовка к новому сезону', 'Повышение уровня'],
    mainDirections: 'Комплексная подготовка',
  },
};
