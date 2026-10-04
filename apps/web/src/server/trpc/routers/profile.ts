import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getProfile, listMemoryAnchors } from "../data";
import { profileSchema, anchorSchema } from "@vibeplan/shared";

export const profileRouter = router({
  /** Профиль текущего пользователя (захардкожен в Phase 2a). */
  me: publicProcedure.query(({ ctx }) => getProfile(ctx.userId)),

  /** Обновить настройки (Phase 2c: UPDATE users). */
  update: publicProcedure
    .input(profileSchema.partial())
    .mutation(({ ctx, input }) => {
      // В Phase 2c: db.update(users).set(input).where(eq(users.id, ctx.userId))
      return { ok: true as const, userId: ctx.userId, patch: input };
    }),

  /** Список активных якорей памяти Майи. */
  anchors: publicProcedure.query(({ ctx }) => listMemoryAnchors(ctx.userId)),

  /** Добавить новый якорь (текст или голосом). */
  addAnchor: publicProcedure
    .input(anchorSchema)
    .mutation(({ ctx, input }) => {
      return {
        ok: true as const,
        anchor: {
          id: crypto.randomUUID(),
          userId: ctx.userId,
          ...input,
          createdAt: new Date(),
          archivedAt: null,
        },
      };
    }),

  /** Архивировать якорь. */
  archiveAnchor: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => ({ ok: true as const, id: input.id })),
});