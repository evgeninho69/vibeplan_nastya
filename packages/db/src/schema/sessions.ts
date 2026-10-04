import {
  pgTable,
  uuid,
  text,
  smallint,
  time,
  date,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** Пользовательские сессии дня (учебные блоки, помодоро, встречи, отдых). */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    kind: text("kind").notNull(), // study|pomodoro|deep_sprint|coffee|sport|rest|creative
    startsAt: time("starts_at").notNull(),
    endsAt: time("ends_at").notNull(),
    title: text("title").notNull(),
    subjectCode: text("subject_code"),
    location: text("location"),
    friendHandle: text("friend_handle"),
    notes: text("notes"),
    status: text("status").notNull().default("planned"), // planned|active|done|skipped
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userDate: index("sessions_user_date_idx").on(t.userId, t.date),
  })
);

/** Завершённые pomodoro-сессии. */
export const pomodoros = pgTable("pomodoros", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  workMin: smallint("work_min").notNull().default(25),
  restMin: smallint("rest_min").notNull().default(5),
  cycles: smallint("cycles").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  interruptions: smallint("interruptions").notNull().default(0),
});