import { z } from "zod";
import {
  SUBJECT_CODES,
  SESSION_KINDS,
  MAYA_TONES,
  ANCHOR_CATEGORIES,
  THEME_IDS,
} from "./constants";

/** Строгий regex: часы 00-23, минуты 00-59. */
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Профиль пользователя (используется в tRPC и формах). */
export const profileSchema = z.object({
  name: z.string().min(1).max(120),
  grade: z.number().int().min(1).max(11),
  goalText: z.string().max(280).optional(),
  antiBurnout: z.boolean().default(true),
  energyToday: z.number().min(0).max(10).default(7),
  mayaTone: z.enum(MAYA_TONES).default("caring"),
  mayaSoftness: z.number().int().min(0).max(100).default(95),
  mayaModel: z.string().default("anthropic/claude-3.5-sonnet"),
  theme: z.enum(THEME_IDS).default("matcha"),
  tz: z.string().default("Europe/Moscow"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

/** Пользовательская сессия в расписании дня. */
export const sessionSchema = z.object({
  date: z.string().regex(DATE_RE),
  kind: z.enum(SESSION_KINDS),
  startsAt: z.string().regex(TIME_RE),
  endsAt: z.string().regex(TIME_RE),
  title: z.string().min(1).max(160),
  subjectCode: z.enum(SUBJECT_CODES).optional().nullable(),
  location: z.string().max(160).optional().nullable(),
  friendHandle: z.string().max(64).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});
export type SessionInput = z.infer<typeof sessionSchema>;

/** Урок школы (из расписания / OCR). */
export const lessonSchema = z.object({
  date: z.string().regex(DATE_RE),
  number: z.number().int().min(1).max(12),
  startsAt: z.string().regex(TIME_RE),
  endsAt: z.string().regex(TIME_RE),
  subjectCode: z.enum(SUBJECT_CODES).optional().nullable(),
  subjectRaw: z.string().max(120),
  room: z.string().max(40).optional().nullable(),
  teacher: z.string().max(120).optional().nullable(),
  homework: z.string().max(2000).optional().nullable(),
  homeworkDue: z.string().regex(DATE_RE).optional().nullable(),
  done: z.boolean().default(false),
});
export type LessonInput = z.infer<typeof lessonSchema>;

/** Результат парсинга расписания OCR. */
export const ocrScheduleSchema = z.object({
  week: z.array(
    z.object({
      day: z.enum(["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]),
      lessons: z.array(lessonSchema.omit({ date: true })),
    })
  ),
  confidence: z.number().min(0).max(1),
  rawText: z.string().optional(),
});
export type OcrScheduleResult = z.infer<typeof ocrScheduleSchema>;

/** Якорь памяти (контекстный факт о пользователе). */
export const anchorSchema = z.object({
  category: z.enum(ANCHOR_CATEGORIES),
  content: z.string().min(1).max(500),
  source: z.enum(["voice", "text", "ocr", "auto"]).default("text"),
  confidence: z.number().int().min(0).max(100).default(100),
});
export type AnchorInput = z.infer<typeof anchorSchema>;

/** Запись привычки за день. */
export const habitLogSchema = z.object({
  habitCode: z.string().min(1).max(64),
  date: z.string().regex(DATE_RE),
  value: z.number().int().min(0).max(1000),
  metadata: z.record(z.any()).optional(),
  note: z.string().max(2000).optional(),
});
export type HabitLogInput = z.infer<typeof habitLogSchema>;

/** Статус по теме кодификатора. */
export const topicProgressSchema = z.object({
  topicId: z.string().uuid(),
  status: z.enum(["new", "in_progress", "completed", "needs_review"]),
  confidence: z.number().int().min(0).max(100).optional(),
  solvedCount: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
});
export type TopicProgressInput = z.infer<typeof topicProgressSchema>;

/** Сообщение в чат с Майей. */
export const mayaMessageSchema = z.object({
  content: z.string().min(1).max(4000),
});
export type MayaMessageInput = z.infer<typeof mayaMessageSchema>;