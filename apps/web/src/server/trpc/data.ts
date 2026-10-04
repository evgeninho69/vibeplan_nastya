/**
 * Data-access слой. Авто-выбор mock vs Postgres.
 */
import { MOCK_SESSIONS, MOCK_HABIT_LOGS, MOCK_ANCHORS, MOCK_VIBE, MOCK_USER, MOCK_TODAY, MOCK_HABITS } from "@vibeplan/db/mock";

type Mode = "mock" | "postgres";
function detectMode(): Mode {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) return "postgres";
  return "mock";
}
const mode = detectMode();
function dbLog(stage: string, ...rest: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(`[data:${mode}] ${stage}`, ...rest);
}
dbLog("init");

async function getDb() {
  const mod = await import("@vibeplan/db/client");
  return mod.db;
}

export async function getTodaySchedule(userId: string, date: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { sessions } = await import("@vibeplan/db/schema");
    const { and, eq } = await import("drizzle-orm");
    return {
      date,
      sessions: await db.select().from(sessions)
        .where(and(eq(sessions.userId, userId), eq(sessions.date, date)))
        .orderBy(sessions.startsAt),
    };
  }
  return { date, sessions: MOCK_SESSIONS.filter((s) => s.userId === userId && s.date === date) };
}

export async function getDailyVibe(userId: string, date: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { dailyVibes } = await import("@vibeplan/db/schema");
    const { and, eq } = await import("drizzle-orm");
    const rows = await db.select().from(dailyVibes)
      .where(and(eq(dailyVibes.userId, userId), eq(dailyVibes.date, date))).limit(1);
    return rows[0] ?? null;
  }
  return MOCK_VIBE.userId === userId && MOCK_VIBE.date === date ? MOCK_VIBE : null;
}

export async function getHabits(userId: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { habits } = await import("@vibeplan/db/schema");
    const { eq } = await import("drizzle-orm");
    return db.select().from(habits).where(eq(habits.userId, userId));
  }
  return MOCK_HABITS;
}

export async function getHabitLogs(userId: string, date: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { habitLogs } = await import("@vibeplan/db/schema");
    const { and, eq } = await import("drizzle-orm");
    return db.select().from(habitLogs)
      .where(and(eq(habitLogs.userId, userId), eq(habitLogs.date, date)));
  }
  return MOCK_HABIT_LOGS.filter((l) => l.userId === userId && l.date === date);
}

export async function logHabit(userId: string, input: { habitCode: string; date: string; value: number; metadata?: Record<string, unknown> | null; note?: string | null }) {
  if (mode === "postgres") {
    const db = await getDb();
    const { habitLogs, habits } = await import("@vibeplan/db/schema");
    const { and, eq, sql } = await import("drizzle-orm");
    const habitRows = await db.select().from(habits).where(and(eq(habits.userId, userId), eq(habits.code, input.habitCode))).limit(1);
    if (!habitRows[0]) throw new Error("Habit not found");
    const habitId = habitRows[0].id;
    const [row] = await db.insert(habitLogs).values({
      userId, habitId, date: input.date, value: input.value,
      metadata: input.metadata ?? null, note: input.note ?? null,
    }).onConflictDoUpdate({
      target: [habitLogs.userId, habitLogs.habitId, habitLogs.date],
      set: { value: sql`${habitLogs.value} + ${input.value}`, metadata: input.metadata ?? null, note: input.note ?? null },
    }).returning();
    return row;
  }
  // mock-store: append to in-memory list (mutates module-level array; fine for dev)
  const habit = MOCK_HABITS.find((h) => h.code === input.habitCode);
  const existing = MOCK_HABIT_LOGS.find((l) => l.userId === userId && (l as { habitCode?: string }).habitCode === input.habitCode && l.date === input.date)
    ?? MOCK_HABIT_LOGS.find((l) => l.userId === userId && l.date === input.date);
  const habitId = habit?.id ?? existing?.habitId ?? "habit-unknown";
  return {
    id: crypto.randomUUID(),
    userId,
    habitId,
    date: input.date,
    value: input.value,
    metadata: input.metadata ?? null,
    note: input.note ?? null,
  };
}

export async function listMemoryAnchors(userId: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { memoryAnchors } = await import("@vibeplan/db/schema");
    const { and, eq, isNull, desc } = await import("drizzle-orm");
    return db.select().from(memoryAnchors)
      .where(and(eq(memoryAnchors.userId, userId), isNull(memoryAnchors.archivedAt)))
      .orderBy(desc(memoryAnchors.createdAt));
  }
  return MOCK_ANCHORS.filter((a) => a.userId === userId && !a.archivedAt)
    .sort((a, b) => +b.createdAt - +a.createdAt);
}

export async function getProfile(userId: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { users } = await import("@vibeplan/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return rows[0] ?? null;
  }
  return userId === MOCK_USER.id ? MOCK_USER : null;
}

export async function updateProfile(userId: string, patch: Record<string, unknown>) {
  if (mode === "postgres") {
    const db = await getDb();
    const { users } = await import("@vibeplan/db/schema");
    const { eq } = await import("drizzle-orm");
    const [row] = await db.update(users).set(patch).where(eq(users.id, userId)).returning();
    return row ?? null;
  }
  // mock: shallow merge into MOCK_USER
  Object.assign(MOCK_USER, patch);
  // Persist in cookie-friendly form for SSR
  if (typeof window === "undefined") return MOCK_USER;
  return MOCK_USER;
}

export async function listEgeModules(subjectCode: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { egeModules, egeTopics } = await import("@vibeplan/db/schema");
    const { eq, asc } = await import("drizzle-orm");
    const modules = await db.select().from(egeModules)
      .where(eq(egeModules.subjectCode, subjectCode)).orderBy(asc(egeModules.sortOrder));
    const topics = await db.select().from(egeTopics).where(eq(egeTopics.subjectCode, subjectCode));
    return modules.map((m) => ({ ...m, topics: topics.filter((t) => t.moduleId === m.id) }));
  }
  // mock: read from shared seed data
  const { FIPI_CATALOG } = await import("@vibeplan/shared");
  const subject = FIPI_CATALOG.find((c) => c.subject === subjectCode);
  if (!subject) return [];
  return subject.modules.map((m, idx) => ({
    id: `mod-${subjectCode}-${m.code}`,
    subjectCode,
    name: m.name,
    sortOrder: idx,
    fipiYear: subject.year,
    topics: m.topics.map((t) => ({
      id: `topic-${subjectCode}-${m.code}-${t.code}`,
      subjectCode,
      moduleId: `mod-${subjectCode}-${m.code}`,
      code: t.code,
      name: t.name,
      fipiYear: subject.year,
    })),
  }));
}

export async function listUserSubjects(userId: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { userSubjects } = await import("@vibeplan/db/schema");
    const { eq } = await import("drizzle-orm");
    return db.select().from(userSubjects).where(eq(userSubjects.userId, userId));
  }
  return [];
}

export async function getEgeProgress(userId: string, subjectCode: string) {
  if (mode === "postgres") {
    const db = await getDb();
    const { egeProgress, egeTopics } = await import("@vibeplan/db/schema");
    const { and, eq, inArray } = await import("drizzle-orm");
    const topicIds = await db.select({ id: egeTopics.id }).from(egeTopics).where(eq(egeTopics.subjectCode, subjectCode));
    if (topicIds.length === 0) return [];
    return db.select().from(egeProgress)
      .where(and(eq(egeProgress.userId, userId), inArray(egeProgress.topicId, topicIds.map((t) => t.id))));
  }
  return [];
}

export async function upsertEgeProgress(userId: string, topicId: string, status: string, confidence?: number) {
  if (mode === "postgres") {
    const db = await getDb();
    const { egeProgress } = await import("@vibeplan/db/schema");
    const { and, eq, sql } = await import("drizzle-orm");
    const [row] = await db.insert(egeProgress).values({
      userId, topicId, status, confidence: confidence ?? 0, lastReviewed: new Date().toISOString().slice(0, 10),
    }).onConflictDoUpdate({
      target: [egeProgress.userId, egeProgress.topicId],
      set: { status, confidence: confidence ?? 0, lastReviewed: new Date().toISOString().slice(0, 10), updatedAt: new Date() },
    }).returning();
    return row;
  }
  return { id: crypto.randomUUID(), userId, topicId, status, confidence: confidence ?? 0, updatedAt: new Date() };
}

export async function getCurrentUserId() {
  return MOCK_USER.id;
}

export const TODAY = MOCK_TODAY;
export const DATA_MODE = mode;

/** История чата с Майей (Phase 6). */
export async function listChatMessages(userId: string, limit = 50) {
  if (mode === "postgres") {
    const db = await getDb();
    const { chatMessages } = await import("@vibeplan/db/schema");
    const { eq, desc } = await import("drizzle-orm");
    return db.select().from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .then((rows) => rows.reverse());
  }
  return [];
}

export async function appendChatMessage(
  userId: string,
  role: "user" | "maya" | "system",
  content: string,
  meta: { model?: string; tokensIn?: number; tokensOut?: number; latencyMs?: number } = {}
) {
  if (mode === "postgres") {
    const db = await getDb();
    const { chatMessages } = await import("@vibeplan/db/schema");
    const [row] = await db.insert(chatMessages).values({
      userId, role, content,
      model: meta.model ?? null,
      tokensIn: meta.tokensIn ?? null,
      tokensOut: meta.tokensOut ?? null,
      latencyMs: meta.latencyMs ?? null,
    }).returning();
    return row;
  }
  // mock: эхо-ответ
  return {
    id: crypto.randomUUID(),
    userId,
    role,
    content,
    model: meta.model ?? null,
    tokensIn: meta.tokensIn ?? null,
    tokensOut: meta.tokensOut ?? null,
    latencyMs: meta.latencyMs ?? 0,
    contextMeta: null,
    createdAt: new Date(),
  };
}