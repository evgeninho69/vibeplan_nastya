import NextAuth from "next-auth";
import { authConfig } from "./config";
import { startJobs } from "@/server/jobs/antiBurnoutWatcher";

// Запускаем джобы (anti-burnout watcher + daily vibe generator) ровно один раз.
if (process.env.NODE_ENV !== "test") startJobs();

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/** Удобный хелпер: достаём userId из сессии или возвращаем dev-fallback. */
export async function currentUserId(): Promise<string> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (id) return id;
  // В dev/Phase 2a — используем mock-user, чтобы страницы рендерились без auth.
  const { MOCK_USER } = await import("@vibeplan/db/mock");
  return MOCK_USER.id;
}