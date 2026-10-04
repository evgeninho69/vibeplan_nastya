import {
  pgTable,
  uuid,
  text,
  smallint,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/** Друзья (Phase 2). */
export const friends = pgTable("friends", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  handle: text("handle").notNull(),
  displayName: text("display_name"),
  telegram: text("telegram"),
  availability: jsonb("availability").$type<Record<string, { start: string; end: string }[]>>(),
  toleranceMin: smallint("tolerance_min").notNull().default(15),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Коворкинг-комнаты (Phase 2). */
export const focusRooms = pgTable(
  "focus_rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostId: uuid("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    kind: text("kind").notNull().default("silent_25_5"), // silent_25_5|deep_sprint|lofifocus
    participants: jsonb("participants").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    hostIdx: index("focus_rooms_host_idx").on(t.hostId, t.startsAt),
  })
);

/** Внешние интеграции (Telegram, Notion, календари). */
export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(), // telegram|notion|apple_cal|google_cal
  externalId: text("external_id").notNull(),
  externalToken: text("external_token"), // encrypt on write
  meta: jsonb("meta").$type<Record<string, unknown>>(),
  connectedAt: timestamp("connected_at", { withTimezone: true }).notNull().defaultNow(),
});