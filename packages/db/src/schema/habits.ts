import {
  pgTable,
  uuid,
  text,
  smallint,
  date,
  jsonb,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** Определения привычек. */
export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // water|matcha|reading|breath_478|rowing|morning_matcha
  title: text("title").notNull(),
  unit: text("unit").notNull(), // glass|page|min|session
  targetPerDay: smallint("target_per_day").notNull().default(1),
  targetMetadata: jsonb("target_metadata").$type<Record<string, unknown>>(),
  isCreative: boolean("is_creative").notNull().default(false),
});

/** Логи привычек по дням. */
export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    habitId: uuid("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    value: smallint("value").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    note: text("note"),
  },
  (t) => ({
    userHabitDateUnique: uniqueIndex("habit_logs_user_habit_date_unique").on(t.userId, t.habitId, t.date),
    userDateIdx: index("habit_logs_user_date_idx").on(t.userId, t.date),
  })
);