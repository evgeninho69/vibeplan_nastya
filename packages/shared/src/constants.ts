/**
 * Константы, общие между фронтом и бэком. Не зависят от Node/React.
 */

export const APP_NAME = "ВайбПлан";
export const MENTOR_NAME = "Майя";

/** Коды предметов ЕГЭ (совпадают с SUBJECT_TOKENS в @vibeplan/ui). */
export const SUBJECT_CODES = [
  "prof_math",
  "math_base",
  "russian",
  "informatics",
  "physics",
  "literature",
  "history",
  "social",
  "english",
  "biology",
  "chemistry",
] as const;
export type SubjectCode = (typeof SUBJECT_CODES)[number];

export const SUBJECT_LABELS: Record<SubjectCode, { full: string; short: string }> = {
  prof_math:  { full: "Профильная математика", short: "Проф. математика" },
  math_base:  { full: "Базовая математика",    short: "Базовая математика" },
  russian:    { full: "Русский язык",          short: "Русский язык" },
  informatics:{ full: "Информатика (КЕГЭ)",    short: "КЕГЭ Информатика" },
  physics:    { full: "Физика",                short: "Физика" },
  literature: { full: "Литература",            short: "Литература" },
  history:    { full: "История России",        short: "История" },
  social:     { full: "Обществознание",        short: "Обществознание" },
  english:    { full: "Английский язык",       short: "Английский" },
  biology:    { full: "Биология",              short: "Биология" },
  chemistry:  { full: "Химия",                 short: "Химия" },
};

/** Виды сессий (расписание дня). */
export const SESSION_KINDS = [
  "study",        // учебный блок
  "pomodoro",     // 25/5
  "deep_sprint",  // 50/10
  "coffee",       // кофе-брейк с другом
  "sport",        // спорт / тренировка
  "rest",         // отдых / дыхательная пауза
  "creative",     // творческий проект
] as const;
export type SessionKind = (typeof SESSION_KINDS)[number];

export const SESSION_KIND_LABELS: Record<SessionKind, string> = {
  study: "Учёба",
  pomodoro: "Помодоро",
  deep_sprint: "Глубокий спринт",
  coffee: "Кофе-брейк",
  sport: "Спорт",
  rest: "Отдых",
  creative: "Творчество",
};

/** Тоны наставника Майи. */
export const MAYA_TONES = ["caring", "academic", "zen"] as const;
export type MayaTone = (typeof MAYA_TONES)[number];

export const MAYA_TONE_LABELS: Record<MayaTone, { name: string; description: string }> = {
  caring: {
    name: "Бережная подруга",
    description: "Мягкая поддержка, напоминания попить воды и подышать, никаких токсичных дедлайнов и чувства вины. Всегда предлагает разбить задачу на микро-шаги.",
  },
  academic: {
    name: "Академический наставник",
    description: "Чёткие спринты, акцент на кодификатор ФИПИ, алгоритмы задач второй части и разбор строгих критериев экспертов.",
  },
  zen: {
    name: "Дзен-коуч",
    description: "Дыхательные практики 4–7–8, медитативные перерывы, баланс между греблей, сном и решением пробников без суеты.",
  },
};

/** Категории якорей памяти. */
export const ANCHOR_CATEGORIES = ["study", "rest", "sport", "creative"] as const;
export type AnchorCategory = (typeof ANCHOR_CATEGORIES)[number];

export const ANCHOR_CATEGORY_LABELS: Record<AnchorCategory, string> = {
  study: "Учёба & Экзамены",
  rest: "Отдых & Места силы",
  sport: "Спорт & Здоровье",
  creative: "Творчество & Хобби",
};

/** Темы оформления. */
export const THEME_IDS = ["matcha", "lavender", "coffee", "rose"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

/** Привычки по умолчанию (шаблон для нового пользователя). */
export const DEFAULT_HABITS = [
  { code: "water",          title: "Вода",                  unit: "glass", target_per_day: 7 },
  { code: "matcha",         title: "Матча-латте",           unit: "glass", target_per_day: 1 },
  { code: "morning_matcha", title: "Утренний матча-ритуал", unit: "session", target_per_day: 1 },
  { code: "reading",        title: "Чтение",                unit: "page",   target_per_day: 20 },
  { code: "breath_478",     title: "Дыхательная пауза 4-7-8", unit: "session", target_per_day: 2 },
  { code: "rowing",         title: "Гребля в клубе",        unit: "session", target_per_day: 1 },
] as const;

/** Кодификатор ФИПИ 2025: модули профильной математики (для seed). */
export const FIPI_PROF_MATH_2025_MODULES = [
  {
    code: "algebra",
    name: "Модуль 1: Алгебра и уравнения",
    topics: [
      { code: "1", name: "Числа и их свойства" },
      { code: "2", name: "Степени и корни" },
      { code: "3", name: "Логарифмы" },
      { code: "4", name: "Тригонометрия" },
      { code: "5", name: "Уравнения" },
      { code: "6", name: "Неравенства" },
      { code: "7", name: "Системы уравнений" },
      { code: "8", name: "Задачи с параметром" },
    ],
  },
  {
    code: "geometry",
    name: "Модуль 2: Планиметрия и стереометрия",
    topics: [
      { code: "9",  name: "Треугольники" },
      { code: "10", name: "Четырёхугольники" },
      { code: "11", name: "Окружность" },
      { code: "12", name: "Площади фигур" },
      { code: "13", name: "Подобие" },
      { code: "14", name: "Координаты и векторы" },
      { code: "15", name: "Призма и пирамида" },
      { code: "16", name: "Тела вращения" },
    ],
  },
  {
    code: "calculus",
    name: "Модуль 3: Функции, параметры, теория чисел",
    topics: [
      { code: "17", name: "Функции и их графики" },
      { code: "18", name: "Производная" },
      { code: "19", name: "Интеграл" },
      { code: "20", name: "Задачи с параметром" },
      { code: "21", name: "Теория чисел" },
      { code: "22", name: "Экономические задачи" },
    ],
  },
] as const;

export const FIPI_RUSSIAN_2025_MODULES = [
  { code: "r1", name: "Задание 1-26: тестовые и краткие ответы", topics: [
    { code: "1",  name: "Орфография" }, { code: "2",  name: "Пунктуация" }, { code: "3",  name: "Орфоэпия" },
    { code: "4",  name: "Лексика" },    { code: "5",  name: "Морфемика" },  { code: "6",  name: "Морфология" },
    { code: "7",  name: "Синтаксис" },  { code: "8",  name: "Текст" },      { code: "9",  name: "Речевая культура" },
  ]},
  { code: "r2", name: "Сочинение (задание 27)", topics: [
    { code: "10", name: "Проблема текста" }, { code: "11", name: "Комментарий" }, { code: "12", name: "Позиция автора" },
    { code: "13", name: "Обоснование" },     { code: "14", name: "Речевые ошибки" },
  ]},
] as const;

export const FIPI_INFORMATICS_2025_MODULES = [
  { code: "i1", name: "Задания 1-23: базовая теория", topics: [
    { code: "1", name: "Системы счисления" }, { code: "2", name: "Логика" }, { code: "3", name: "Моделирование" },
    { code: "4", name: "Алгоритмы" },         { code: "5", name: "Сети" },  { code: "6", name: "Кодирование" },
  ]},
  { code: "i2", name: "Задания 24-27: программирование", topics: [
    { code: "7",  name: "Обработка строк (Python)" }, { code: "8",  name: "Рекурсия и списки" },
    { code: "9",  name: "Словари и множества" },      { code: "10", name: "Файлы и графы" },
  ]},
] as const;

/** Все кодификаторы для seed. */
export const FIPI_CATALOG = [
  { subject: "prof_math" as SubjectCode, year: 2025, modules: FIPI_PROF_MATH_2025_MODULES },
  { subject: "russian" as SubjectCode,   year: 2025, modules: FIPI_RUSSIAN_2025_MODULES },
  { subject: "informatics" as SubjectCode, year: 2025, modules: FIPI_INFORMATICS_2025_MODULES },
];