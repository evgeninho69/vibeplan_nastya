/**
 * Базовый tRPC-сервер. Использует superjson для дат и не-сериализуемых типов.
 * Context пока — статический (захардкоженный пользователь из mock-store).
 * В Phase 2b сюда добавится Auth.js session.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Session as AuthSession } from "next-auth";

export type Context = {
  /** Заголовки запроса (нужны для NextAuth + cookies). */
  headers: Headers;
  /** Сессия пользователя (пока опционально). */
  session: AuthSession | null;
  /** ID текущего пользователя — из сессии или из дев-фоллбэка. */
  userId: string;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/** Публичная процедура — без middleware. */
export const publicProcedure = t.procedure;

/** Защищённая процедура — требует сессии (в дев-режиме пропускает). */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session && process.env.NODE_ENV === "production") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Нужна авторизация" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.session?.user?.id ?? ctx.userId,
    },
  });
});

export const router = t.router;
export const middleware$ = t.middleware;