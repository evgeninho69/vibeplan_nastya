import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { getTodaySchedule, getDailyVibe, getHabitLogs, TODAY } from "../data";
import { sessionSchema } from "@vibeplan/shared";

export const todayRouter = router({
  /** Расписание дня + сессии пользователя (защищено — Phase 2b). */
  getSchedule: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const date = input?.date ?? TODAY;
      return getTodaySchedule(ctx.userId, date);
    }),

  /** Вайб дня (текст + предложение Майи). */
  getVibe: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const date = input?.date ?? TODAY;
      return getDailyVibe(ctx.userId, date);
    }),

  /** Привычки за день. */
  getHabits: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const date = input?.date ?? TODAY;
      return getHabitLogs(ctx.userId, date);
    }),

  /** Создать новую сессию (Phase 2b — protected, Phase 2a — public на mock). */
  addSession: publicProcedure
    .input(sessionSchema)
    .mutation(async ({ ctx, input }) => {
      // В Phase 2c: insert into `sessions` через Drizzle.
      // Сейчас — эхо-ответ, чтобы UI мог тестировать optimistic-обновления.
      return {
        ok: true as const,
        session: {
          id: crypto.randomUUID(),
          userId: ctx.userId,
          ...input,
          status: "planned" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }),
});