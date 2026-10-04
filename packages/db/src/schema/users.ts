import {
  pgTable,
  uuid,
  text,
  smallint,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    grade: smallint("grade"),
    tz: text("tz").notNull().default("Europe/Moscow"),
    goalText: text("goal_text"),
    antiBurnout: boolean("anti_burnout").notNull().default(true),
    energyToday: smallint("energy_today").notNull().default(7),
    mayaTone: text("maya_tone").notNull().default("caring"), // caring|academic|zen
    mayaSoftness: smallint("maya_softness").notNull().default(95),
    mayaModel: text("maya_model").notNull().default("anthropic/claude-3.5-sonnet"),
    theme: text("theme").notNull().default("matcha"), // matcha|lavender|coffee|rose
    profileSummary: text("profile_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;