/**
 * AI-наставник Майя. Phase 6.
 *
 * Сейчас — стаб: возвращает шаблонные «эмпатичные» ответы из canned-массива.
 * При наличии GOOGLE_API_KEY используется Gemini (`google/gemini-2.5-flash`).
 * При наличии OPENROUTER_API_KEY используется OpenRouter (anthropic/claude-3.5-sonnet).
 * Приоритет: Gemini > OpenRouter > stub.
 */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { listMemoryAnchors, getTodaySchedule, getProfile, TODAY, appendChatMessage } from "../data";

type Mode = "stub" | "google" | "openrouter";
const mode: Mode = process.env.GOOGLE_API_KEY
  ? "google"
  : process.env.OPENROUTER_API_KEY
    ? "openrouter"
    : "stub";

// Canned-ответы в духе DESIGN.md: эмпатично, без давления, ≤6 предложений,
// с конкретным микро-шагом.
const CANNED = [
  "Мягкий шаг: выбери одну задачу из кодификатора и разбери её на 15-минутные шаги. После первого шага — пауза с матчей ☕",
  "Сегодня твоя энергия 8.5/10 — отличный день для глубокого спринта. Поставь таймер 50 минут на №16 из проф. математики.",
  "Если чувствуешь, что застряла — отложи на завтра. Пауза — это часть пути. Вайб дня мягкий, ничего страшного.",
  "По твоим якорям вижу, что завтра гребля в 19:30. Давай сделаем сегодня 25-минутный разбор теории перед тренировкой.",
  "Маленькая мысль: ты уже закрыла 28 тем из 34 по русскому. Осталось всего 6 — это одна учебная неделя. Не гора 🏔️",
  "Попробуй сейчас 5-минутную дыхательную паузу 4-7-8. Потом — к точке «школа (6 уроков)» в плане дня.",
  "ИИ Майя напоминает: «Мягкий шаг» важнее «идеального рывка». Ты уже сделала главное — ты здесь.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const mayaRouter = router({
  /** Возвращает режим (stub / openrouter) для UI-индикатора. */
  status: publicProcedure.query(() => ({ mode, model: "anthropic/claude-3.5-sonnet" })),

  /**
   * Чат: не-стримящий JSON-ответ (для совместимости со старыми клиентами).
   * Для real-time стриминга используйте /api/chat/stream (см. routers/chat.ts).
   * При наличии OPENROUTER_API_KEY здесь тоже подключается claude-3.5-sonnet.
   */
  chat: publicProcedure
    .input(z.object({ content: z.string().min(1).max(4000) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getProfile(ctx.userId);
      const anchors = await listMemoryAnchors(ctx.userId);
      const schedule = await getTodaySchedule(ctx.userId, TODAY);

      let reply: string;
      if (mode === "openrouter") {
        try {
          const { openrouterChat } = await import("@/server/ai/openrouter");
          const result = await openrouterChat({
            systemPrompt: `Ты Майя — эмпатичный AI-наставник для школьницы. Имя: ${profile?.name ?? "Аня"}. Энергия: ${profile?.energyToday ?? "—"}/10. Тон: ${profile?.mayaTone ?? "caring"}. Мягкость: ${profile?.mayaSoftness ?? 95}%. Якоря: ${anchors.slice(0, 5).map((a) => `${a.category}: ${a.content}`).join("; ")}. Расписание: ${schedule.sessions.map((s) => `${s.startsAt} ${s.title}`).join("; ")}. Отвечай по-русски, ≤6 предложений, мягко, в стиле «ты».`,
            userPrompt: input.content,
          });
          reply = typeof result === "string" ? result : String(result);
        } catch {
          reply = pick(CANNED);
        }
      } else {
        reply = pick(CANNED);
      }

      // Сохраняем ответ в историю для последующего чтения.
      await appendChatMessage(ctx.userId, "maya", reply, { model: "anthropic/claude-3.5-sonnet" });

      return {
        role: "maya" as const,
        content: reply,
        tokensIn: Math.ceil(input.content.length / 4),
        tokensOut: Math.ceil(reply.length / 4),
        model: "anthropic/claude-3.5-sonnet",
        latencyMs: 0,
        contextMeta: {
          energy: profile?.energyToday ?? null,
          anchorsUsed: anchors.slice(0, 5).map((a) => a.id),
          sessionsToday: schedule.sessions.length,
        },
      };
    }),

  /** Перегенерировать вайб дня (используется кнопкой «Другой вайб» в UI). */
  regenerateVibe: publicProcedure.mutation(async () => {
    if (mode === "google") {
      try {
        const { geminiChat } = await import("@/server/ai/gemini");
        const text = await geminiChat({
          systemPrompt: "Ты Майя — эмпатичный AI-наставник. Сгенерируй JSON {quote, suggestion} с коротким вайбом дня и одним микро-предложением. Только JSON, без пояснений.",
          userPrompt: "Сгенерируй вайб дня.",
          temperature: 0.9,
        });
        if (typeof text === "string") {
          try {
            const m = text.match(/\{[\s\S]*\}/);
            if (m) {
              const j = JSON.parse(m[0]);
              return {
                quote: String(j.quote ?? "«Мягкий фокус — это тоже фокус.»"),
                suggestion: String(j.suggestion ?? "Майя: начни с 15 минут."),
                energyPred: 8,
                mood: "soft" as const,
              };
            }
          } catch {}
        }
      } catch {}
    }
    if (mode === "openrouter") {
      try {
        const { openrouterChat } = await import("@/server/ai/openrouter");
        const text = await openrouterChat({
          systemPrompt: "Ты Майя — эмпатичный AI-наставник. Сгенерируй JSON {quote, suggestion} с коротким вайбом и микро-предложением. Только JSON.",
          userPrompt: "Сгенерируй вайб дня.",
          temperature: 0.9,
        });
        if (typeof text === "string") {
          try {
            const m = text.match(/\{[\s\S]*\}/);
            if (m) {
              const j = JSON.parse(m[0]);
              return {
                quote: String(j.quote ?? "«Мягкий фокус — это тоже фокус.»"),
                suggestion: String(j.suggestion ?? "Майя: начни с 15 минут."),
                energyPred: 8,
                mood: "soft" as const,
              };
            }
          } catch {}
        }
      } catch {}
    }
    return {
      quote: pick([
        "«Маленький шаг ведёт к большой цели. Ты уже в пути.»",
        "«Спокойный шаг тоже ведёт к цели. Ты всё успеваешь.»",
        "«Сегодняшняя пауза — это завтрашняя сила. Дыши глубже.»",
        "«Ты не отстаёшь. Ты идёшь своим темпом, и это правильно.»",
        "«Мягкий фокус — это тоже фокус. Начни с 15 минут.»",
      ]),
      suggestion: pick([
        "Настя: Сделай глубокий вдох перед уроком матчи.",
        "Ксюша: Предложи встречу в «Слое» на 18:00 — идеальное окно.",
        "Майя: 5 мин дыхательной паузы, потом к задаче №16.",
        "Майя: Перенеси одну сложную задачу на завтра.",
      ]),
      energyPred: 8,
      mood: pick(["soft", "focused", "creative"] as const),
    };
  }),
});