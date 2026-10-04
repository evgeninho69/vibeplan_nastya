import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { listEgeModules, listUserSubjects, getEgeProgress, upsertEgeProgress } from "../data";

export const egeRouter = router({
  /** Все модули и темы по предмету (из ФИПИ seed). */
  modules: publicProcedure
    .input(z.object({ subjectCode: z.enum(["prof_math", "russian", "informatics", "physics", "literature", "history", "social", "english", "biology", "chemistry"]) }))
    .query(({ input }) => listEgeModules(input.subjectCode)),

  /** Все предметы, выбранные пользователем (user_subjects). */
  mySubjects: publicProcedure.query(({ ctx }) => listUserSubjects(ctx.userId)),

  /** Прогресс пользователя по предмету (набор строк из ege_progress). */
  progress: publicProcedure
    .input(z.object({ subjectCode: z.string() }))
    .query(({ ctx, input }) => getEgeProgress(ctx.userId, input.subjectCode)),

  /** Обновить статус темы (чек/анчек). */
  markTopic: publicProcedure
    .input(z.object({
      topicId: z.string(),
      status: z.enum(["new", "in_progress", "completed", "needs_review"]),
      confidence: z.number().int().min(0).max(100).optional(),
    }))
    .mutation(({ ctx, input }) => upsertEgeProgress(ctx.userId, input.topicId, input.status, input.confidence)),
});