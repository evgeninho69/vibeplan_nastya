import {
  pgTable,
  uuid,
  text,
  smallint,
  date,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** Связь пользователь × выбранный предмет ЕГЭ (цель и текущий балл). */
export const userSubjects = pgTable(
  "user_subjects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subjectCode: text("subject_code").notNull(), // prof_math|russian|...
    targetScore: smallint("target_score"),
    currentScore: smallint("current_score"),
    startedAt: date("started_at"),
    examDate: date("exam_date"),
  },
  (t) => ({
    userSubjectUnique: uniqueIndex("user_subjects_user_subject_unique").on(t.userId, t.subjectCode),
  })
);

/** Модули предмета («Планиметрия», «Уравнения и неравенства»). */
export const egeModules = pgTable(
  "ege_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectCode: text("subject_code").notNull(),
    name: text("name").notNull(),
    sortOrder: smallint("sort_order").notNull().default(0),
    fipiYear: smallint("fipi_year").notNull().default(2025),
  },
  (t) => ({
    bySubject: index("ege_modules_subject_idx").on(t.subjectCode, t.sortOrder),
  })
);

/** Темы кодификатора ФИПИ. */
export const egeTopics = pgTable(
  "ege_topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectCode: text("subject_code").notNull(),
    moduleId: uuid("module_id").notNull().references(() => egeModules.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // '1'..'19' для математики
    name: text("name").notNull(),
    fipiYear: smallint("fipi_year").notNull().default(2025),
  },
  (t) => ({
    bySubject: index("ege_topics_subject_idx").on(t.subjectCode, t.fipiYear),
    byModule: index("ege_topics_module_idx").on(t.moduleId, t.code),
  })
);

/** Прогресс пользователя по каждой теме. */
export const egeProgress = pgTable(
  "ege_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id").notNull().references(() => egeTopics.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("new"), // new|in_progress|completed|needs_review
    confidence: smallint("confidence").notNull().default(0),
    lastReviewed: date("last_reviewed"),
    solvedCount: smallint("solved_count").notNull().default(0),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userTopicUnique: uniqueIndex("ege_progress_user_topic_unique").on(t.userId, t.topicId),
    userIdx: index("ege_progress_user_idx").on(t.userId),
  })
);

/** Пробники ЕГЭ. */
export const mockExams = pgTable("mock_exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectCode: text("subject_code").notNull(),
  date: date("date").notNull(),
  primaryScore: smallint("primary_score"),
  secondaryScore: smallint("secondary_score"),
  totalScore: smallint("total_score").notNull(),
  weakTopics: jsonb("weak_topics").$type<{ topicId: string; delta: number }[]>().default([]),
  notes: text("notes"),
});