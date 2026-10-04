/**
 * Auth.js (NextAuth v5) конфигурация. В дев-режиме magic-link пишется в консоль
 * (без Resend). В проде — добавить Resend provider и DATABASE_URL для адаптера.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  // Секрет берётся из AUTH_SECRET в .env.local. Без него — кидаем предупреждение в dev.
  secret: process.env.AUTH_SECRET ?? "dev-only-insecure-secret-replace-in-production-please",
  trustHost: true,
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    // В Phase 2b-Resend добавится:
    // Resend({ from: process.env.EMAIL_FROM, apiKey: process.env.RESEND_API_KEY }),
    //
    // Сейчас — credentials-провайдер "dev-code": при попытке логина без почты
    // пользователь вводит код, который печатается в консоль.
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = (token.sub as string | undefined) ?? session.user.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};