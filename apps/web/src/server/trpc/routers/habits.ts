import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getHabits, getHabitLogs, logHabit } from "../data";
import { habitLogSchema } from "@vibeplan/shared";

export const habitsRouter = router({
  /** Определения привычек пользователя. */
  list: publicProcedure.query(({ ctx }) => getHabits(ctx.userId)),

  /** Логи привычек за конкретный день. */
  logs: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(({ ctx, input }) => getHabitLogs(ctx.userId, input?.date ?? "2025-10-24")),

  /** Инкремент привычки (воды +1 стакан, чтение +5 страниц и т.п.). */
  log: publicProcedure
    .input(habitLogSchema)
    .mutation(({ ctx, input }) => logHabit(ctx.userId, input)),

  /** Удалить лог за день (например, случайно ткнул +1). */
  resetDay: publicProcedure
    .input(z.object({ habitCode: z.string(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
    .mutation(async ({ ctx, input }) => {
      // В Phase 2c: DELETE FROM habit_logs WHERE user_id = $1 AND habit_id = ... AND date = $2
      return { ok: true as const, userId: ctx.userId, ...input };
    }),
});