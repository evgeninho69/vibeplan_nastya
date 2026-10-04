import {
  pgTable,
  uuid,
  text,
  smallint,
  time,
  date,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** Расписание (одно активное на пользователя, источник: school / mess / eljur / manual / ocr). */
export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  source: text("source").notNull().default("school"), // school|manual|mess|eljur|ocr
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  rawOcr: jsonb("raw_ocr").$type<unknown>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Уроки школы. */
export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    scheduleId: uuid("schedule_id").references(() => schedules.id, { onDelete: "set null" }),
    date: date("date").notNull(),
    number: smallint("number").notNull(),
    startsAt: time("starts_at").notNull(),
    endsAt: time("ends_at").notNull(),
    subjectCode: text("subject_code"),
    subjectRaw: text("subject_raw").notNull(),
    room: text("room"),
    teacher: text("teacher"),
    homework: text("homework"),
    homeworkDue: date("homework_due"),
    done: boolean("done").notNull().default(false),
    voiceNotesUrl: text("voice_notes_url"),
  },
  (t) => ({
    userDate: index("lessons_user_date_idx").on(t.userId, t.date),
  })
);