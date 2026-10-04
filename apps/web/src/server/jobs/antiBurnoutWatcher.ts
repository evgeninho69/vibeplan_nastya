/**
 * Anti-burnout watcher + генератор вайба дня. Phase 7.
 *
 * Запускается по крону (BullMQ в проде, setInterval в дев) и:
 * - считает streak энергии за 3 дня подряд
 * - если energy_today < 5 три дня подряд — генерирует «бережный план»
 * - генерирует вайб дня для каждого пользователя на 06:30 локального времени
 *
 * Сейчас — single-process scheduler с in-memory очередью. В проде заменяется на
 * BullMQ + Redis (см. README).
 */
import { listUsersWithLowEnergy, generateAndSaveVibe, generateAndSaveAntiBurnoutNudge } from "@/server/jobs/jobs-data";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const SIX_THIRTY_MS = (() => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(6, 30, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
})();

declare global {
  // eslint-disable-next-line no-var
  var __vp_jobs_started__: boolean | undefined;
}

export function startJobs() {
  if (globalThis.__vp_jobs_started__) return;
  globalThis.__vp_jobs_started__ = true;

  // Генератор вайба дня — раз в сутки в 06:30.
  const vibeTimer = setTimeout(function tick() {
    // eslint-disable-next-line no-console
    console.log("[jobs] generating daily vibes…");
    generateAndSaveVibe().catch((e) => console.error("[jobs] vibe error", e));
    setTimeout(tick, SIX_HOURS_MS);
  }, SIX_THIRTY_MS);

  // Anti-burnout watcher — каждые 6 часов.
  const burnoutTimer = setInterval(async () => {
    try {
      const lowEnergyUsers = await listUsersWithLowEnergy(3);
      // eslint-disable-next-line no-console
      console.log(`[jobs] anti-burnout: ${lowEnergyUsers.length} пользователей с низкой энергией`);
      for (const u of lowEnergyUsers) {
        await generateAndSaveAntiBurnoutNudge(u.userId);
      }
    } catch (e) {
      console.error("[jobs] burnout error", e);
    }
  }, SIX_HOURS_MS);

  // eslint-disable-next-line no-console
  console.log(`[jobs] started: next vibe at ${new Date(Date.now() + SIX_THIRTY_MS).toISOString()}`);

  return () => {
    clearTimeout(vibeTimer);
    clearInterval(burnoutTimer);
    globalThis.__vp_jobs_started__ = false;
  };
}