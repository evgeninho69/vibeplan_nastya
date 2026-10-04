/**
 * Admin-роутер. Только для пользователей с флагом ADMIN_USER_IDS в env (через запятую).
 * Используется для:
 * - seed ФИПИ 2025 в БД
 * - сброса состояния anti-burnout nudge
 * - миграции вручную (если нет CLI)
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { FIPI_CATALOG } from "@vibeplan/shared";

function adminUserIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS ?? "";
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

function requireAdmin(userId: string) {
  const ids = adminUserIds();
  if (ids.size === 0) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "ADMIN_USER_IDS не задан. Добавьте свой user_id в .env.local",
    });
  }
  if (!ids.has(userId)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Недостаточно прав" });
  }
}

export const adminRouter = router({
  /** Idempotentный seed кодификатора ФИПИ 2025 (3 предмета). */
  seedFipi: publicProcedure
    .input(z.object({ dryRun: z.boolean().default(false) }).optional())
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.userId);
      const mode = process.env.DATABASE_URL ? "postgres" : "mock";
      if (mode === "mock") {
        return { ok: true as const, mode, message: "Mock-store — данные уже зашиты в код" };
      }
      const { egeModules, egeTopics } = await import("@vibeplan/db/schema");
      const db = (await import("@vibeplan/db/client")).db;

      let modulesInserted = 0;
      let topicsInserted = 0;

      for (const catalog of FIPI_CATALOG) {
        for (const mod of catalog.modules) {
          if (input?.dryRun) { modulesInserted++; continue; }
          const existing = await db.query.egeModules.findFirst({
            where: (t, { and, eq }) =>
              and(eq(t.subjectCode, catalog.subject), eq(t.name, mod.name)),
          });
          let moduleId: string;
          if (existing) {
            moduleId = existing.id;
          } else {
            const [row] = await db.insert(egeModules).values({
              subjectCode: catalog.subject,
              name: mod.name,
              sortOrder: modulesInserted,
              fipiYear: catalog.year,
            }).returning();
            if (!row) throw new Error("Insert returned null");
            moduleId = row.id;
            modulesInserted++;
          }
          for (const topic of mod.topics) {
            if (input?.dryRun) { topicsInserted++; continue; }
            const exists = await db.query.egeTopics.findFirst({
              where: (t, { and, eq }) =>
                and(eq(t.subjectCode, catalog.subject), eq(t.code, topic.code), eq(t.moduleId, moduleId)),
            });
            if (!exists) {
              await db.insert(egeTopics).values({
                subjectCode: catalog.subject,
                moduleId,
                code: topic.code,
                name: topic.name,
                fipiYear: catalog.year,
              });
              topicsInserted++;
            }
          }
        }
      }
      return {
        ok: true as const,
        mode,
        subjects: FIPI_CATALOG.length,
        modulesInserted,
        topicsInserted,
      };
    }),

  /** Статус системы: сколько таблиц, сколько записей. */
  status: publicProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.userId);
    const mode = process.env.DATABASE_URL ? "postgres" : "mock";
    if (mode === "mock") {
      return { ok: true as const, mode, message: "Mock-store (in-memory)" };
    }
    const schema = await import("@vibeplan/db/schema");
    const db = (await import("@vibeplan/db/client")).db;
    const counts: Record<string, number> = {};
    for (const [name, table] of Object.entries(schema.schema)) {
      try {
        const rows = await db.select().from(table).limit(1);
        counts[name] = rows.length;
      } catch {
        counts[name] = -1;
      }
    }
    return { ok: true as const, mode, counts };
  }),
});