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

/**
 * Якоря памяти Майи. embedding:vector(1536) — добавится отдельной миграцией,
 * когда подключим pgvector (см. README).
 */
export const memoryAnchors = pgTable(
  "memory_anchors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    category: text("category").notNull(), // study|rest|sport|creative
    content: text("content").notNull(),
    source: text("source").notNull().default("text"), // voice|text|ocr|auto
    confidence: smallint("confidence").notNull().default(100),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => ({
    userIdx: index("memory_anchors_user_idx").on(t.userId, t.createdAt),
  })
);

/** Вайб дня — короткая фраза и предложение от Майи. */
export const dailyVibes = pgTable(
  "daily_vibes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    quote: text("quote").notNull(),
    suggestion: text("suggestion"),
    energyPred: smallint("energy_pred"),
    mood: text("mood"), // soft|focused|creative
    generatedBy: text("generated_by").notNull(),
  },
  (t) => ({
    userDateUnique: uniqueIndex("daily_vibes_user_date_unique").on(t.userId, t.date),
  })
);

/** Сообщения чата с Майей. */
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // user|maya|system
    content: text("content").notNull(),
    tokensIn: smallint("tokens_in"),
    tokensOut: smallint("tokens_out"),
    model: text("model"),
    latencyMs: smallint("latency_ms"),
    contextMeta: jsonb("context_meta").$type<{
      scheduleVersion?: string;
      anchorsUsed?: string[];
      tone?: string;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userCreatedIdx: index("chat_messages_user_created_idx").on(t.userId, t.createdAt),
  })
);