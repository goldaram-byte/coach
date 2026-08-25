import {
  Exercise,
  Program,
  Group,
  Athlete,
  Competition,
  Workout,
  TrainingWeekPlan,
  BlockTemplate,
  TemplateExercise,
} from './types';

// ---------- helpers ----------

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Date of this week's day (0 = Monday) with offset in weeks */
export const weekdayDate = (weekday: number, weekOffset = 0): string => {
  const now = new Date();
  const monday = new Date(now);
  const jsDay = (now.getDay() + 6) % 7; // 0 = Monday
  monday.setDate(now.getDate() - jsDay + weekOffset * 7);
  const d = new Date(monday);
  d.setDate(monday.getDate() + weekday);
  return iso(d);
};

export const todayISO = () => iso(new Date());

const addDays = (base: string, days: number): string => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return iso(d);
};

// ---------- Exercises library ----------

export const seedExercises: Exercise[] = [
  // Разминка / ОФП
  {
    id: 'ex-jog',
    name: 'Лёгкий бег с заданиями',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Бег по залу в лёгком темпе с заданиями тренера: приставные шаги, бег спиной вперёд, ускорения по сигналу.',
    goal: 'Разогрев организма, подготовка к основной части тренировки',
    durationMin: 5,
    difficulty: 'beginner',
    ageMin: 5,
    commonMistakes: 'Слишком высокий темп в начале, разговоры во время бега',
    videos: [],
  },
  {
    id: 'ex-joint-warmup',
    name: 'Суставная разминка',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Круговые вращения в суставах сверху вниз: шея, плечи, локти, кисти, таз, колени, голеностопы. По 8–10 повторений в каждую сторону.',
    goal: 'Подготовка суставов и связок к нагрузке',
    durationMin: 5,
    sets: 1,
    reps: 10,
    difficulty: 'beginner',
    ageMin: 5,
    videos: [],
  },
  {
    id: 'ex-dynamic-stretch',
    name: 'Динамическая растяжка',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Махи ногами вперёд, в сторону, назад с опорой и без. Выпады с проворотом корпуса, наклоны в движении.',
    goal: 'Развитие динамической гибкости, подготовка мышц к ударной работе',
    durationMin: 7,
    sets: 2,
    reps: 10,
    difficulty: 'beginner',
    commonMistakes: 'Рывковые движения без контроля, согнутая спина',
    videos: [],
  },
  {
    id: 'ex-pushups',
    name: 'Отжимания',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Классические отжимания от пола. Корпус прямой, локти под 45 градусов к корпусу, полная амплитуда.',
    goal: 'Развитие силы мышц груди, плеч и трицепса',
    durationMin: 3,
    sets: 3,
    reps: 15,
    difficulty: 'beginner',
    commonMistakes: 'Провисание таза, неполная амплитуда',
    simplifiedVariant: 'Отжимания с колен',
    advancedVariant: 'Отжимания с хлопком',
    videos: [],
  },
  {
    id: 'ex-squats',
    name: 'Приседания',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Приседания с собственным весом. Спина прямая, колени не выходят за носки, пятки на полу.',
    goal: 'Развитие силы ног и ягодичных мышц',
    durationMin: 3,
    sets: 3,
    reps: 20,
    difficulty: 'beginner',
    simplifiedVariant: 'Приседания на стул',
    advancedVariant: 'Приседания с выпрыгиванием',
    videos: [],
  },
  {
    id: 'ex-plank',
    name: 'Планка',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Упор лёжа на предплечьях. Тело образует прямую линию от головы до пяток. Живот подтянут.',
    goal: 'Укрепление мышечного корсета',
    durationMin: 3,
    sets: 3,
    reps: 1,
    difficulty: 'beginner',
    commonMistakes: 'Поднятый таз, провисание поясницы',
    advancedVariant: 'Планка с попеременным подъёмом ног',
    videos: [],
  },
  {
    id: 'ex-ladder',
    name: 'Координационная лестница',
    category: 'sfp',
    stage: 'beginner',
    description:
      'Работа на координационной лестнице: бег с высоким подниманием бедра, приставные шаги, два касания в ячейке, «классики».',
    goal: 'Развитие частоты работы ног и координации',
    equipment: 'Координационная лестница',
    durationMin: 8,
    sets: 4,
    reps: 2,
    difficulty: 'beginner',
    videos: [],
  },
  // Работа ног / СФП
  {
    id: 'ex-footwork-fwd',
    name: 'Передвижения вперёд-назад',
    category: 'sfp',
    stage: 'beginner',
    description:
      'В боевой стойке: шаг вперёд — подшаг, шаг назад — отшаг. Сохранять дистанцию между стопами, не подпрыгивать.',
    goal: 'Постановка базовых передвижений в стойке',
    durationMin: 5,
    sets: 3,
    reps: 10,
    difficulty: 'beginner',
    commonMistakes: 'Скрещивание ног, потеря стойки при движении',
    videos: [],
  },
  {
    id: 'ex-distance-change',
    name: 'Смена дистанции',
    category: 'sfp',
    stage: 'intermediate',
    description:
      'Работа в парах: партнёр двигается произвольно, задача — сохранять заданную дистанцию (дальнюю/среднюю). Смена ролей каждые 30 секунд.',
    goal: 'Развитие чувства дистанции',
    durationMin: 6,
    sets: 4,
    reps: 1,
    difficulty: 'intermediate',
    videos: [],
  },
  {
    id: 'ex-reaction-signal',
    name: 'Реакция на сигнал',
    category: 'sfp',
    stage: 'beginner',
    description:
      'Спортсмены стоят в стойке. По хлопку — быстрый подшаг вперёд, по свистку — отшаг назад, по голосу — смена стойки. Сигналы в случайном порядке.',
    goal: 'Развитие скорости реакции и стартовой скорости',
    durationMin: 5,
    sets: 3,
    reps: 10,
    difficulty: 'beginner',
    videos: [],
  },
  {
    id: 'ex-explosive-start',
    name: 'Взрывной старт из стойки',
    category: 'sfp',
    stage: 'intermediate',
    description:
      'Из боевой стойки — максимально быстрый вход на дистанцию атаки с возвратом. Акцент на толчок задней ногой.',
    goal: 'Развитие взрывной стартовой скорости',
    durationMin: 6,
    sets: 4,
    reps: 6,
    difficulty: 'intermediate',
    commonMistakes: 'Замах перед стартом, подъём центра тяжести',
    videos: [],
  },
  // Техника / Кумитэ
  {
    id: 'ex-kizami',
    name: 'Kizami-zuki',
    category: 'kumite',
    stage: 'beginner',
    description:
      'Прямой удар передней рукой в голову с подшагом. Возврат руки быстрее удара. Работа у зеркала и по лапе.',
    goal: 'Постановка быстрого атакующего удара передней рукой',
    durationMin: 8,
    sets: 3,
    reps: 15,
    difficulty: 'beginner',
    commonMistakes: 'Опускание второй руки, наклон корпуса вперёд',
    simplifiedVariant: 'Удар на месте без подшага',
    advancedVariant: 'Kizami-zuki с уходом с линии атаки',
    videos: [],
  },
  {
    id: 'ex-gyaku',
    name: 'Gyaku-zuki',
    category: 'kumite',
    stage: 'beginner',
    description:
      'Обратный удар задней рукой в корпус с подшагом. Вращение бедра, задняя пятка отрывается. Работа у зеркала, по лапе и в парах.',
    goal: 'Постановка основного контратакующего удара',
    durationMin: 10,
    sets: 3,
    reps: 15,
    difficulty: 'beginner',
    commonMistakes: 'Нет вращения бедра, удар только рукой, потеря равновесия',
    simplifiedVariant: 'Gyaku-zuki на месте',
    advancedVariant: 'Gyaku-zuki в контратаке после защиты',
    videos: [],
  },
  {
    id: 'ex-mawashi',
    name: 'Mawashi-geri',
    category: 'kumite',
    stage: 'intermediate',
    description:
      'Круговой удар ногой в средний и верхний уровень. Вынос колена, разворот опорной стопы, хлёсткое разгибание.',
    goal: 'Постановка кругового удара ногой',
    durationMin: 10,
    sets: 3,
    reps: 12,
    difficulty: 'intermediate',
    commonMistakes: 'Нет разворота опорной стопы, низкое колено при выносе',
    simplifiedVariant: 'Вынос колена с фиксацией у опоры',
    advancedVariant: 'Mawashi-geri в прыжке со сменой ног',
    videos: [],
  },
  {
    id: 'ex-counter-combo',
    name: 'Контратака после сбива',
    category: 'kumite',
    stage: 'intermediate',
    description:
      'В парах: партнёр атакует kizami-zuki, выполняется сбив передней рукой и контратака gyaku-zuki в корпус. Скорость нарастает от медленной к боевой.',
    goal: 'Развитие навыка своевременной контратаки',
    durationMin: 10,
    sets: 4,
    reps: 10,
    difficulty: 'intermediate',
    commonMistakes: 'Контратака с опозданием, отсутствие защиты после контратаки',
    videos: [],
  },
  {
    id: 'ex-first-attack',
    name: 'Атака первым номером',
    category: 'kumite',
    stage: 'intermediate',
    description:
      'Работа в парах по заданию: атакующий ищет момент для входа kizami — gyaku, защищающийся только защищается и разрывает дистанцию.',
    goal: 'Развитие навыка своевременной атаки и работы на дистанции',
    durationMin: 12,
    sets: 4,
    reps: 1,
    difficulty: 'intermediate',
    videos: [],
  },
  {
    id: 'ex-free-sparring',
    name: 'Учебное кумитэ',
    category: 'kumite',
    stage: 'intermediate',
    description:
      'Свободная работа в парах по правилам WKF на 50–70% скорости с контролем. Смена партнёров каждые 90 секунд.',
    goal: 'Применение техники в свободной работе',
    equipment: 'Накладки, капа, протекторы',
    durationMin: 12,
    sets: 4,
    reps: 1,
    difficulty: 'intermediate',
    videos: [],
  },
  // Ката
  {
    id: 'ex-heian-shodan',
    name: 'Heian Shodan',
    category: 'kata',
    stage: 'beginner',
    description:
      'Первая ката серии Heian: 21 движение, базовые блоки gedan-barai и age-uke, удар oi-zuki. Отработка по счёту и без счёта.',
    goal: 'Изучение последовательности, направлений и ритма базовой ката',
    durationMin: 12,
    sets: 5,
    reps: 1,
    difficulty: 'beginner',
    commonMistakes: 'Ошибки в направлениях поворотов, неодновременность блока и стойки',
    videos: [],
  },
  {
    id: 'ex-kata-elements',
    name: 'Базовые элементы ката',
    category: 'kata',
    stage: 'beginner',
    description:
      'Отработка отдельных связок ката: переходы между стойками zenkutsu-dachi и kokutsu-dachi, блоки с шагом.',
    goal: 'Координация, чистота стоек и переходов',
    durationMin: 10,
    sets: 3,
    reps: 8,
    difficulty: 'beginner',
    videos: [],
  },
  // Тактика
  {
    id: 'ex-tactic-lefty',
    name: 'Работа против левши',
    category: 'tactics',
    stage: 'advanced',
    description:
      'Парная работа против партнёра в левосторонней стойке: контроль внешней линии, атака через переднюю руку, уход от gyaku.',
    goal: 'Тактическая подготовка к бою с левшой',
    durationMin: 12,
    sets: 3,
    reps: 1,
    difficulty: 'advanced',
    videos: [],
  },
  {
    id: 'ex-tactic-lastsec',
    name: 'Последние секунды боя',
    category: 'tactics',
    stage: 'advanced',
    description:
      'Моделирование: 15 секунд до конца боя, счёт минус один балл. Задача — набрать балл, не пропустив контратаку. Смена сценариев: защита преимущества, отыгрывание.',
    goal: 'Отработка тактики концовки боя',
    durationMin: 10,
    sets: 5,
    reps: 1,
    difficulty: 'advanced',
    videos: [],
  },
  // Психология / игровые
  {
    id: 'ex-game-tag',
    name: 'Игра «Салки в стойке»',
    category: 'psychology',
    stage: 'beginner',
    description:
      'Игра в салки, передвигаясь только в боевой стойке приставными шагами. Осалить можно касанием плеча.',
    goal: 'Игровое закрепление передвижений, эмоциональная разгрузка',
    durationMin: 5,
    difficulty: 'beginner',
    ageMin: 5,
    ageMax: 10,
    videos: [],
  },
  {
    id: 'ex-breathing',
    name: 'Дыхание и концентрация',
    category: 'psychology',
    stage: 'beginner',
    description:
      'Сидя в seiza: медленный вдох на 4 счёта, задержка на 2, выдох на 6. Глаза закрыты, внимание на дыхании.',
    goal: 'Восстановление, развитие концентрации',
    durationMin: 5,
    difficulty: 'beginner',
    videos: [],
  },
  {
    id: 'ex-static-stretch',
    name: 'Статическая растяжка',
    category: 'ofp',
    stage: 'beginner',
    description:
      'Продольные и поперечные шпагаты с фиксацией 20–30 секунд, наклоны к прямым ногам, растяжка квадрицепса и голени.',
    goal: 'Развитие гибкости, восстановление после нагрузки',
    durationMin: 8,
    difficulty: 'beginner',
    videos: [],
  },
];

// ---------- Week plan template ----------

const makeWeek = (id: string, number: number, theme: string): TrainingWeekPlan => ({
  id,
  number,
  theme,
  days: [
    { id: `${id}-d0`, weekday: 0, focus: 'Координация + техника', rest: false },
    { id: `${id}-d1`, weekday: 1, focus: 'ОФП + гибкость', rest: false },
    { id: `${id}-d2`, weekday: 2, focus: 'Кумитэ + работа в парах', rest: false },
    { id: `${id}-d3`, weekday: 3, focus: 'Отдых / восстановление', rest: true },
    { id: `${id}-d4`, weekday: 4, focus: 'Ката + техника', rest: false },
    { id: `${id}-d5`, weekday: 5, focus: 'Игровая / соревновательная практика', rest: false },
    { id: `${id}-d6`, weekday: 6, focus: 'Отдых', rest: true },
  ],
});

// ---------- Programs ----------

export const seedPrograms: Program[] = [
  {
    id: 'prog-beginner',
    name: 'Начальная подготовка',
    stage: 'beginner',
    description:
      'Создание физической, технической и координационной базы для дальнейшего развития спортсмена.',
    stageTasks: [
      'Координация, гибкость, ловкость, скорость реакции',
      'Стойки, передвижения, базовые удары руками и ногами, блоки',
      'Чувство дистанции, простые атаки и контратаки',
      'Базовые элементы ката: последовательность, ритм, направления',
      'Дисциплина, концентрация, уверенность, работа в группе',
    ],
    years: [
      {
        id: 'py-b1',
        number: 1,
        goals: ['Адаптация к тренировкам', 'Базовая техника', 'Координационная база'],
        periods: [
          {
            id: 'pp-b1-1',
            name: 'Осенний подготовительный',
            type: 'preparation',
            months: [
              {
                id: 'pm-sep',
                monthNumber: 9,
                name: 'Сентябрь',
                goals: ['Адаптация к тренировкам', 'Дисциплина', 'Координация', 'Базовые стойки'],
                directions: 'Физическая подготовка, координация, базовая техника',
                workoutsPlanned: 13,
                progress: 100,
                weeks: [
                  makeWeek('pw-sep-1', 1, 'Знакомство, стойки, дисциплина'),
                  makeWeek('pw-sep-2', 2, 'Базовые стойки и равновесие'),
                  makeWeek('pw-sep-3', 3, 'Координация + первые передвижения'),
                  makeWeek('pw-sep-4', 4, 'Закрепление месяца'),
                ],
              },
              {
                id: 'pm-oct',
                monthNumber: 10,
                name: 'Октябрь',
                goals: ['Базовые передвижения', 'Удары руками', 'Гибкость', 'Реакция'],
                directions: 'Техническая подготовка, работа ног',
                workoutsPlanned: 13,
                progress: 100,
                weeks: [
                  makeWeek('pw-oct-1', 1, 'Передвижения в стойке'),
                  makeWeek('pw-oct-2', 2, 'Kizami-zuki'),
                  makeWeek('pw-oct-3', 3, 'Gyaku-zuki'),
                  makeWeek('pw-oct-4', 4, 'Связка kizami — gyaku'),
                ],
              },
              {
                id: 'pm-nov',
                monthNumber: 11,
                name: 'Ноябрь',
                goals: ['Удары ногами', 'Работа на дистанции', 'Базовое кумитэ'],
                directions: 'Техническая подготовка, кумитэ',
                workoutsPlanned: 12,
                progress: 100,
                weeks: [
                  makeWeek('pw-nov-1', 1, 'Mae-geri'),
                  makeWeek('pw-nov-2', 2, 'Mawashi-geri'),
                  makeWeek('pw-nov-3', 3, 'Дистанция в парах'),
                  makeWeek('pw-nov-4', 4, 'Игровое кумитэ'),
                ],
              },
              {
                id: 'pm-dec',
                monthNumber: 12,
                name: 'Декабрь',
                goals: ['Базовые блоки', 'Стабильность техники', 'Баланс'],
                directions: 'Техническая подготовка, защита',
                workoutsPlanned: 11,
                progress: 100,
                weeks: [
                  makeWeek('pw-dec-1', 1, 'Age-uke, soto-uke'),
                  makeWeek('pw-dec-2', 2, 'Блок + контратака'),
                  makeWeek('pw-dec-3', 3, 'Комбинации месяца'),
                  makeWeek('pw-dec-4', 4, 'Аттестация и праздник'),
                ],
              },
            ],
          },
          {
            id: 'pp-b1-2',
            name: 'Зимне-весенний основной',
            type: 'preparation',
            months: [
              {
                id: 'pm-jan',
                monthNumber: 1,
                name: 'Январь',
                goals: ['Повторение базовых техник', 'Выносливость', 'ОФП'],
                directions: 'Общая физическая подготовка',
                workoutsPlanned: 12,
                progress: 100,
                weeks: [
                  makeWeek('pw-jan-1', 1, 'ОФП блок'),
                  makeWeek('pw-jan-2', 2, 'Повторение техники'),
                  makeWeek('pw-jan-3', 3, 'Выносливость'),
                  makeWeek('pw-jan-4', 4, 'Контрольная неделя'),
                ],
              },
              {
                id: 'pm-feb',
                monthNumber: 2,
                name: 'Февраль',
                goals: ['Ката: базовые элементы', 'Координация', 'Ритм'],
                directions: 'Ката, координация',
                workoutsPlanned: 12,
                progress: 100,
                weeks: [
                  makeWeek('pw-feb-1', 1, 'Стойки и переходы'),
                  makeWeek('pw-feb-2', 2, 'Heian Shodan: первая половина'),
                  makeWeek('pw-feb-3', 3, 'Heian Shodan: полностью'),
                  makeWeek('pw-feb-4', 4, 'Ритм и направления'),
                ],
              },
              {
                id: 'pm-mar',
                monthNumber: 3,
                name: 'Март',
                goals: ['Совершенствование техники', 'Работа в парах', 'Серийные движения'],
                directions: 'Техническая подготовка, кумитэ',
                workoutsPlanned: 13,
                progress: 85,
                weeks: [
                  makeWeek('pw-mar-1', 1, 'Серии ударов руками'),
                  makeWeek('pw-mar-2', 2, 'Рука + нога'),
                  makeWeek('pw-mar-3', 3, 'Задания в парах'),
                  makeWeek('pw-mar-4', 4, 'Контроль техники'),
                ],
              },
            ],
          },
          {
            id: 'pp-b1-3',
            name: 'Соревновательно-игровой',
            type: 'competitive',
            months: [
              {
                id: 'pm-apr',
                monthNumber: 4,
                name: 'Апрель',
                goals: ['Игровые упражнения', 'Соревновательная подготовка'],
                directions: 'Кумитэ, игровые упражнения',
                workoutsPlanned: 13,
                progress: 40,
                weeks: [
                  makeWeek('pw-apr-1', 1, 'Игровое кумитэ'),
                  makeWeek('pw-apr-2', 2, 'Первые старты'),
                  makeWeek('pw-apr-3', 3, 'Разбор и коррекция'),
                  makeWeek('pw-apr-4', 4, 'Клубный турнир'),
                ],
              },
              {
                id: 'pm-may',
                monthNumber: 5,
                name: 'Май',
                goals: ['Тестирование навыков', 'Контроль техники'],
                directions: 'Общее совершенствование',
                workoutsPlanned: 12,
                progress: 0,
                weeks: [
                  makeWeek('pw-may-1', 1, 'Тесты ОФП'),
                  makeWeek('pw-may-2', 2, 'Тесты техники'),
                  makeWeek('pw-may-3', 3, 'Аттестация'),
                  makeWeek('pw-may-4', 4, 'Итоги года'),
                ],
              },
            ],
          },
          {
            id: 'pp-b1-4',
            name: 'Восстановительный',
            type: 'recovery',
            months: [
              {
                id: 'pm-jun',
                monthNumber: 6,
                name: 'Июнь',
                goals: ['Активный отдых', 'Игровая подготовка'],
                directions: 'Восстановление и игровая подготовка',
                workoutsPlanned: 8,
                progress: 0,
                weeks: [
                  makeWeek('pw-jun-1', 1, 'Игровая неделя'),
                  makeWeek('pw-jun-2', 2, 'ОФП на воздухе'),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'py-b2',
        number: 2,
        goals: ['Расширение технической базы', 'Первые соревнования', 'Кумитэ и ката'],
        periods: [],
      },
      {
        id: 'py-b3',
        number: 3,
        goals: ['Стабильность техники', 'Соревновательный опыт', 'Переход в спортивную группу'],
        periods: [],
      },
    ],
  },
  {
    id: 'prog-intermediate',
    name: 'Спортивная группа',
    stage: 'intermediate',
    description:
      'Переход от общего обучения к специализированной спортивной подготовке и соревновательной деятельности.',
    stageTasks: [
      'Кумитэ: атака первым номером, контратака, тайминг, серийные атаки',
      'Ката: скорость, мощность, баланс, стабильность выполнения',
      'ОФП: сила, скорость, выносливость. СФП: взрывная сила, работа ног',
      'Тактика: работа против разных соперников, концовки боёв',
    ],
    years: [
      {
        id: 'py-i2',
        number: 2,
        goals: ['Соревновательная стабильность', 'Тактическая база', 'Специальная выносливость'],
        periods: [
          {
            id: 'pp-i2-1',
            name: 'Подготовительный период',
            type: 'preparation',
            months: [
              {
                id: 'pm-i-aug',
                monthNumber: 8,
                name: 'Август',
                goals: ['Втягивающий блок', 'ОФП база', 'Техника после отпуска'],
                directions: 'ОФП, восстановление техники',
                workoutsPlanned: 16,
                progress: 70,
                weeks: [
                  makeWeek('pw-i-aug-1', 1, 'Втягивающая неделя'),
                  makeWeek('pw-i-aug-2', 2, 'ОФП + техника'),
                  makeWeek('pw-i-aug-3', 3, 'Атака первым номером'),
                  makeWeek('pw-i-aug-4', 4, 'Контратака'),
                ],
              },
              {
                id: 'pm-i-sep',
                monthNumber: 9,
                name: 'Сентябрь',
                goals: ['Тайминг', 'Серийные атаки', 'Специальная выносливость'],
                directions: 'Кумитэ, СФП',
                workoutsPlanned: 18,
                progress: 0,
                weeks: [
                  makeWeek('pw-i-sep-1', 1, 'Тайминг атаки'),
                  makeWeek('pw-i-sep-2', 2, 'Серии в атаке'),
                  makeWeek('pw-i-sep-3', 3, 'Работа вторым номером'),
                  makeWeek('pw-i-sep-4', 4, 'Модельные бои'),
                ],
              },
            ],
          },
          {
            id: 'pp-i2-2',
            name: 'Соревновательный период',
            type: 'competitive',
            months: [
              {
                id: 'pm-i-oct',
                monthNumber: 10,
                name: 'Октябрь',
                goals: ['Подводка к первенству города', 'Тактические планы'],
                directions: 'Соревновательная подготовка',
                workoutsPlanned: 16,
                progress: 0,
                weeks: [
                  makeWeek('pw-i-oct-1', 1, 'Интенсивная неделя'),
                  makeWeek('pw-i-oct-2', 2, 'Подводящая неделя'),
                  makeWeek('pw-i-oct-3', 3, 'Первенство города'),
                  makeWeek('pw-i-oct-4', 4, 'Разбор и восстановление'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'prog-advanced',
    name: 'Спортивное совершенствование',
    stage: 'advanced',
    description: 'Подготовка спортсмена к высоким спортивным результатам.',
    stageTasks: [
      'Индивидуальная техника и тактика',
      'Подготовка к конкретному сопернику, моделирование боёв',
      'Анализ видео, СФП, восстановление',
      'Психологическая подготовка к главным стартам',
    ],
    years: [
      {
        id: 'py-a1',
        number: 1,
        goals: ['Выход на национальный уровень', 'Индивидуальный стиль'],
        periods: [
          {
            id: 'pp-a1-1',
            name: 'Макроцикл: осенний',
            type: 'preparation',
            months: [
              {
                id: 'pm-a-aug',
                monthNumber: 8,
                name: 'Август',
                goals: ['База макроцикла', 'Индивидуальные коронки', 'СФП'],
                directions: 'Индивидуальная работа, СФП',
                workoutsPlanned: 20,
                progress: 65,
                weeks: [
                  makeWeek('pw-a-aug-1', 1, 'Ударный микроцикл'),
                  makeWeek('pw-a-aug-2', 2, 'Ударный микроцикл'),
                  makeWeek('pw-a-aug-3', 3, 'Разгрузочный микроцикл'),
                  makeWeek('pw-a-aug-4', 4, 'Модельные бои'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ---------- Groups ----------

export const seedGroups: Group[] = [
  {
    id: 'grp-kids-6-7',
    name: 'Дети 6–7 лет',
    ageMin: 6,
    ageMax: 7,
    stage: 'beginner',
    schedule: [
      { weekday: 0, time: '16:00' },
      { weekday: 2, time: '16:00' },
      { weekday: 4, time: '16:00' },
    ],
    programId: 'prog-beginner',
  },
  {
    id: 'grp-kids-8-9',
    name: 'Дети 8–9 лет',
    ageMin: 8,
    ageMax: 9,
    stage: 'beginner',
    schedule: [
      { weekday: 1, time: '16:00' },
      { weekday: 3, time: '16:00' },
      { weekday: 5, time: '11:00' },
    ],
    programId: 'prog-beginner',
  },
  {
    id: 'grp-sport',
    name: 'Спортивная группа',
    ageMin: 10,
    ageMax: 14,
    stage: 'intermediate',
    schedule: [
      { weekday: 0, time: '18:00' },
      { weekday: 1, time: '18:00' },
      { weekday: 2, time: '18:00' },
      { weekday: 4, time: '18:00' },
      { weekday: 5, time: '12:30' },
    ],
    programId: 'prog-intermediate',
  },
  {
    id: 'grp-elite',
    name: 'Сборная',
    ageMin: 14,
    ageMax: 17,
    stage: 'advanced',
    schedule: [
      { weekday: 0, time: '19:30' },
      { weekday: 2, time: '19:30' },
      { weekday: 4, time: '19:30' },
      { weekday: 5, time: '14:00' },
    ],
    programId: 'prog-advanced',
  },
];

// ---------- Athletes ----------

export const seedAthletes: Athlete[] = [
  {
    id: 'ath-1',
    firstName: 'Артём',
    lastName: 'Ким',
    birthDate: '2012-04-15',
    weightKg: 42,
    category: 'Кумитэ −45 кг',
    experienceYears: 4,
    rank: '2 юн. разряд',
    groupId: 'grp-sport',
    skills: { speed: 8, reaction: 7, technique: 7, tactics: 6, endurance: 7, strength: 6, flexibility: 8, psychology: 7 },
    goals: ['Стабильный gyaku-zuki в контратаке', 'Призовое место на первенстве города'],
  },
  {
    id: 'ath-2',
    firstName: 'София',
    lastName: 'Ахметова',
    birthDate: '2013-09-02',
    weightKg: 36,
    category: 'Кумитэ −40 кг',
    experienceYears: 3,
    rank: '3 юн. разряд',
    groupId: 'grp-sport',
    skills: { speed: 7, reaction: 8, technique: 8, tactics: 6, endurance: 6, strength: 5, flexibility: 9, psychology: 8 },
    goals: ['Уверенная работа первым номером', 'Освоить mawashi-geri jodan'],
  },
  {
    id: 'ath-3',
    firstName: 'Данияр',
    lastName: 'Сулейменов',
    birthDate: '2010-01-20',
    weightKg: 55,
    category: 'Кумитэ −57 кг',
    experienceYears: 6,
    rank: '1 юн. разряд',
    groupId: 'grp-elite',
    skills: { speed: 9, reaction: 8, technique: 8, tactics: 8, endurance: 8, strength: 7, flexibility: 7, psychology: 7 },
    goals: ['Отбор в сборную области', 'Улучшить работу в концовках боёв'],
  },
  {
    id: 'ath-4',
    firstName: 'Алина',
    lastName: 'Петрова',
    birthDate: '2016-06-11',
    weightKg: 24,
    category: 'Ката',
    experienceYears: 1,
    groupId: 'grp-kids-8-9',
    skills: { speed: 5, reaction: 5, technique: 6, tactics: 3, endurance: 5, strength: 4, flexibility: 8, psychology: 6 },
    goals: ['Heian Shodan без ошибок', 'Участие в первом турнире'],
  },
  {
    id: 'ath-5',
    firstName: 'Мирас',
    lastName: 'Жанибеков',
    birthDate: '2017-03-08',
    weightKg: 22,
    experienceYears: 1,
    groupId: 'grp-kids-6-7',
    skills: { speed: 5, reaction: 6, technique: 4, tactics: 2, endurance: 5, strength: 4, flexibility: 7, psychology: 5 },
    goals: ['Уверенная боевая стойка', 'Дисциплина на тренировке'],
  },
  {
    id: 'ath-6',
    firstName: 'Ерасыл',
    lastName: 'Токтаров',
    birthDate: '2011-11-30',
    weightKg: 47,
    category: 'Кумитэ −50 кг',
    experienceYears: 5,
    rank: '1 юн. разряд',
    groupId: 'grp-sport',
    skills: { speed: 8, reaction: 7, technique: 7, tactics: 7, endurance: 9, strength: 7, flexibility: 6, psychology: 8 },
    goals: ['Серийные атаки', 'Финал областного первенства'],
  },
];

// ---------- Competitions ----------

export const seedCompetitions: Competition[] = [
  {
    id: 'comp-1',
    name: 'Первенство города по каратэ WKF',
    date: addDays(todayISO(), 16),
    location: 'Дворец спорта «Центральный»',
    category: 'Дети, кадеты',
    athleteIds: ['ath-1', 'ath-2', 'ath-6'],
    results: [],
  },
  {
    id: 'comp-2',
    name: 'Областное первенство',
    date: addDays(todayISO(), 44),
    location: 'СК «Олимп»',
    category: 'Кадеты, юниоры',
    athleteIds: ['ath-3', 'ath-6'],
    results: [],
  },
  {
    id: 'comp-3',
    name: 'Клубный турнир «Первый татами»',
    date: addDays(todayISO(), -20),
    location: 'Наш зал',
    category: 'Новички 6–9 лет',
    athleteIds: ['ath-4', 'ath-5'],
    results: [
      { athleteId: 'ath-4', place: 2, fights: 3, wins: 2, note: 'Хорошая стойка, работать над реакцией' },
      { athleteId: 'ath-5', place: 3, fights: 3, wins: 1, note: 'Первый турнир, справился с волнением' },
    ],
  },
];

// ---------- Workouts ----------

// Демо-тренировки убраны: тренеры собирают тренировки сами
// из базовых и личных блоков.
export const seedWorkouts: Workout[] = [];

// ---------- Базовые блоки тренировок (создаёт и редактирует владелец) ----------

const embed = (exerciseId: string, over: Partial<TemplateExercise> = {}): TemplateExercise => {
  const ex = seedExercises.find((e) => e.id === exerciseId)!;
  return {
    id: `te-${exerciseId}`,
    exercise: ex,
    durationMin: ex.durationMin,
    sets: ex.sets,
    reps: ex.reps,
    ...over,
  };
};

const blockDuration = (items: TemplateExercise[]): number =>
  items.reduce((s, te) => s + (te.durationMin ?? 0), 0);

const makeSharedBlock = (
  id: string,
  name: string,
  stage: BlockTemplate['stage'],
  description: string,
  exercises: TemplateExercise[]
): BlockTemplate => ({
  id,
  name,
  stage,
  description,
  durationMin: blockDuration(exercises),
  exercises,
});

/**
 * Стартовый набор базовых блоков — по одному-два на этап.
 * Владелец дополняет и редактирует их в разделе «Блоки».
 */
export const seedSharedBlocks: BlockTemplate[] = [
  makeSharedBlock(
    'sb-warmup-beg',
    'Разминка (базовая)',
    'beginner',
    'Стандартная разминка: бег, суставная разминка, динамическая растяжка.',
    [embed('ex-jog'), embed('ex-joint-warmup'), embed('ex-dynamic-stretch')]
  ),
  makeSharedBlock(
    'sb-cooldown-beg',
    'Заминка (базовая)',
    'beginner',
    'Восстановление после тренировки: растяжка и дыхание.',
    [embed('ex-static-stretch'), embed('ex-breathing')]
  ),
  makeSharedBlock(
    'sb-footwork-beg',
    'Работа ног (базовая)',
    'beginner',
    'Передвижения в стойке и реакция на сигнал.',
    [embed('ex-footwork-fwd'), embed('ex-reaction-signal')]
  ),
  makeSharedBlock(
    'sb-sfp-int',
    'СФП: взрывная скорость',
    'intermediate',
    'Координационная лестница и взрывной старт из стойки.',
    [embed('ex-ladder'), embed('ex-explosive-start')]
  ),
  makeSharedBlock(
    'sb-pair-int',
    'Работа в парах: контратака',
    'intermediate',
    'Контратака после сбива и учебное кумитэ.',
    [embed('ex-counter-combo'), embed('ex-free-sparring')]
  ),
  makeSharedBlock(
    'sb-tactics-adv',
    'Тактика: концовки боя',
    'advanced',
    'Последние секунды боя и работа против левши.',
    [embed('ex-tactic-lastsec'), embed('ex-tactic-lefty')]
  ),
];
