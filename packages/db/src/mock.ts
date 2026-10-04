/**
 * In-memory mock store. Используется фронтендом в Phase 0/1, пока БД не подключена.
 * Тип полностью соответствует Drizzle-схемам, чтобы замена была прозрачной.
 */

import type { sessions, lessons, habits, habitLogs, egeProgress, memoryAnchors, dailyVibes } from "./schema";

export type Session = typeof sessions.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type EgeProgress = typeof egeProgress.$inferSelect;
export type MemoryAnchor = typeof memoryAnchors.$inferSelect;
export type DailyVibe = typeof dailyVibes.$inferSelect;

// Профиль, который мы показываем без реальной авторизации.
export const MOCK_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Аня",
  grade: 11,
  classLabel: "11 «А» класс",
  goalText: "85+ баллов (ВШЭ / МГУ)",
  energyToday: 8.5,
  antiBurnout: true,
  mayaTone: "caring" as const,
  mayaSoftness: 95,
  mayaModel: "anthropic/claude-3.5-sonnet",
  theme: "matcha" as const,
};

// Текущая дата — фиксированная, чтобы мокапы совпадали с реальным контентом.
export const MOCK_TODAY = "2025-10-24"; // четверг (как в coffee_vanilla_matcha_1)

/** Сессии четверга 24 октября (точно как в мокапе coffee_vanilla_matcha_1). */
export const MOCK_SESSIONS: Session[] = [
  {
    id: "s-1",
    userId: MOCK_USER.id,
    date: MOCK_TODAY,
    kind: "school",
    startsAt: "08:30",
    endsAt: "14:15",
    title: "Школа (6 уроков)",
    subjectCode: null,
    location: null,
    friendHandle: null,
    notes: "Конспект по физике в каб. 304 успешно сдан на оценку «5»",
    status: "done",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "s-2",
    userId: MOCK_USER.id,
    date: MOCK_TODAY,
    kind: "deep_sprint",
    startsAt: "15:30",
    endsAt: "17:30",
    title: "Профильная математика: Планиметрия №16",
    subjectCode: "prof_math",
    location: null,
    friendHandle: null,
    notes: "Онлайн-школа «Умскул». Разбор окружностей и вписанных углов.",
    status: "planned",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "s-3",
    userId: MOCK_USER.id,
    date: MOCK_TODAY,
    kind: "coffee",
    startsAt: "18:00",
    endsAt: "19:00",
    title: "Матча в кофейне «Слой» с Ксюшей",
    subjectCode: null,
    location: "Кофейня «Слой», ул. Маяковского 12",
    friendHandle: "ksusha",
    notes: "ИИ нашёл совпадение в графиках! Обсудить пробники и эскизы худи.",
    status: "planned",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "s-4",
    userId: MOCK_USER.id,
    date: MOCK_TODAY,
    kind: "sport",
    startsAt: "19:30",
    endsAt: "20:45",
    title: "Гребной клуб: тренировка на воде / эргометр",
    subjectCode: null,
    location: "Гребной клуб",
    friendHandle: null,
    notes: "Разгрузка спины, серия 4×1000м в мягком аэробном темпе + растяжка.",
    status: "planned",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "s-5",
    userId: MOCK_USER.id,
    date: MOCK_TODAY,
    kind: "creative",
    startsAt: "21:15",
    endsAt: "22:00",
    title: "Пошив оверсайз худи + 3D-печать клипс",
    subjectCode: null,
    location: null,
    friendHandle: null,
    notes: "Проверить напечатанные люверсы на Anycubic, раскрой японского футера.",
    status: "planned",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Кодификатор проф. математики: прогресс (мок — для дашборда). */
export const MOCK_EGE_PROGRESS: EgeProgress[] = [
  { id: "p-1", userId: MOCK_USER.id, topicId: "t-russian-1", status: "completed", confidence: 90, lastReviewed: "2025-10-20", solvedCount: 12, notes: null, updatedAt: new Date() },
  { id: "p-2", userId: MOCK_USER.id, topicId: "t-russian-2", status: "in_progress", confidence: 70, lastReviewed: "2025-10-22", solvedCount: 5, notes: null, updatedAt: new Date() },
  { id: "p-3", userId: MOCK_USER.id, topicId: "t-math-1", status: "completed", confidence: 85, lastReviewed: "2025-10-18", solvedCount: 18, notes: null, updatedAt: new Date() },
  { id: "p-4", userId: MOCK_USER.id, topicId: "t-math-2", status: "in_progress", confidence: 60, lastReviewed: "2025-10-23", solvedCount: 8, notes: null, updatedAt: new Date() },
];

/** Лог привычек за сегодня. */
export const MOCK_HABIT_LOGS: (HabitLog & { habitCode?: string })[] = [
  { id: "h-1", userId: MOCK_USER.id, habitId: "habit-water", habitCode: "water",          date: MOCK_TODAY, value: 4, metadata: null, note: null },
  { id: "h-2", userId: MOCK_USER.id, habitId: "habit-matcha", habitCode: "matcha",         date: MOCK_TODAY, value: 1, metadata: null, note: null },
  { id: "h-3", userId: MOCK_USER.id, habitId: "habit-reading", habitCode: "reading",       date: MOCK_TODAY, value: 18, metadata: { book: "Салли Руни «Нормальные люди»", page: 184 }, note: null },
  { id: "h-4", userId: MOCK_USER.id, habitId: "habit-breath", habitCode: "breath_478",    date: MOCK_TODAY, value: 2, metadata: null, note: null },
  { id: "h-5", userId: MOCK_USER.id, habitId: "habit-morning", habitCode: "morning_matcha", date: MOCK_TODAY, value: 1, metadata: null, note: null },
];

/** Определения привычек по умолчанию для нового пользователя. */
export const MOCK_HABITS: Habit[] = [
  { id: "habit-water",     userId: MOCK_USER.id, code: "water",          title: "Вода",                       unit: "glass",   targetPerDay: 7, targetMetadata: null, isCreative: false },
  { id: "habit-matcha",    userId: MOCK_USER.id, code: "matcha",         title: "Матча-латте",                unit: "glass",   targetPerDay: 1, targetMetadata: null, isCreative: false },
  { id: "habit-morning",   userId: MOCK_USER.id, code: "morning_matcha", title: "Утренний матча-ритуал",      unit: "session", targetPerDay: 1, targetMetadata: null, isCreative: false },
  { id: "habit-reading",   userId: MOCK_USER.id, code: "reading",        title: "Чтение",                     unit: "page",    targetPerDay: 20, targetMetadata: { book: "Салли Руни «Нормальные люди»", page: 184, total: 320 }, isCreative: false },
  { id: "habit-breath",    userId: MOCK_USER.id, code: "breath_478",     title: "Дыхательная пауза 4-7-8",    unit: "session", targetPerDay: 2, targetMetadata: null, isCreative: false },
  { id: "habit-rowing",    userId: MOCK_USER.id, code: "rowing",         title: "Гребля в клубе",             unit: "session", targetPerDay: 1, targetMetadata: null, isCreative: false },
  { id: "habit-jazz",      userId: MOCK_USER.id, code: "jazz_drop",      title: "Jazz — творческий проект",   unit: "session", targetPerDay: 1, targetMetadata: null, isCreative: true },
];

/** Вайб дня. */
export const MOCK_VIBE: DailyVibe = {
  id: "v-1",
  userId: MOCK_USER.id,
  date: MOCK_TODAY,
  quote: "«Спокойный шаг тоже ведёт к цели. Ты всё успеваешь.»",
  suggestion: "Настя: Сделай глубокий вдох перед уроком матчи.",
  energyPred: 8,
  mood: "soft",
  generatedBy: "claude-3.5-sonnet",
};

/** Якоря памяти Майи (для раздела «Профиль & ИИ»). */
export const MOCK_ANCHORS: MemoryAnchor[] = [
  { id: "a-1", userId: MOCK_USER.id, category: "study",   content: "Сдаёт на ЕГЭ 2025: проф. математика, русский, КЕГЭ информатика", source: "text", confidence: 100, createdAt: new Date(), archivedAt: null },
  { id: "a-2", userId: MOCK_USER.id, category: "sport",   content: "Гребля в клубе по пн/чт в 19:30", source: "voice", confidence: 95, createdAt: new Date(), archivedAt: null },
  { id: "a-3", userId: MOCK_USER.id, category: "sport",   content: "Бренд одежды Jazz — 3D-печать из фотополимера", source: "voice", confidence: 90, createdAt: new Date(), archivedAt: null },
  { id: "a-4", userId: MOCK_USER.id, category: "rest",    content: "Ксюша Дубова (11 «Б») — близкая подруга", source: "text", confidence: 100, createdAt: new Date(), archivedAt: null },
  { id: "a-5", userId: MOCK_USER.id, category: "rest",    content: "Кофейня «Слой» на Петроградке — место силы", source: "text", confidence: 95, createdAt: new Date(), archivedAt: null },
  { id: "a-6", userId: MOCK_USER.id, category: "creative",content: "Олимпиады ВШЭ / МГУ — цель на поступление", source: "auto", confidence: 100, createdAt: new Date(), archivedAt: null },
  { id: "a-7", userId: MOCK_USER.id, category: "creative",content: "Пошив оверсайз-худи — творческий проект на 3D-печати клипс", source: "text", confidence: 90, createdAt: new Date(), archivedAt: null },
  { id: "a-8", userId: MOCK_USER.id, category: "rest",    content: "Матча на миндальном — предпочтение вместо обычного латте", source: "text", confidence: 100, createdAt: new Date(), archivedAt: null },
];