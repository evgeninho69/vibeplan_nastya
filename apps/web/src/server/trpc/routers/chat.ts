/**
 * Чат с Майей — история сообщений, отправка (Phase 6).
 * Сейчас работает на canned-ответах, OpenRouter подключается автоматически когда
 * появится ключ.
 */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { listChatMessages, appendChatMessage, getProfile, listMemoryAnchors, getTodaySchedule, TODAY } from "../data";

export const chatRouter = router({
  /** История чата (последние 50 сообщений). */
  history: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).default(50) }).optional())
    .query(({ ctx, input }) => listChatMessages(ctx.userId, input?.limit ?? 50)),

  /** Отправить сообщение → получить ответ Майи (с сохранением в историю). */
  send: publicProcedure
    .input(z.object({ content: z.string().min(1).max(4000) }))
    .mutation(async ({ ctx, input }) => {
      // Сохраняем user-сообщение
      await appendChatMessage(ctx.userId, "user", input.content);

      // Собираем контекст (Phase 6: для OpenRouter)
      const profile = await getProfile(ctx.userId);
      const anchors = await listMemoryAnchors(ctx.userId);
      const schedule = await getTodaySchedule(ctx.userId, TODAY);

      const mode = process.env.OPENROUTER_API_KEY ? "openrouter" : "stub";
      let reply: string;
      if (mode === "openrouter") {
        try {
          const { openrouterChat } = await import("@/server/ai/openrouter");
          const result = await openrouterChat({
            systemPrompt: `Ты Майя — эмпатичный AI-наставник для школьницы. Имя: ${profile?.name ?? "Аня"}. Энергия сегодня: ${profile?.energyToday ?? "—"}/10. Тон: ${profile?.mayaTone ?? "caring"}. Мягкость дедлайнов: ${profile?.mayaSoftness ?? 95}%. Якоря памяти: ${anchors.slice(0, 5).map((a) => `${a.category}: ${a.content}`).join("; ")}. Расписание сегодня: ${schedule.sessions.map((s) => `${s.startsAt} ${s.title}`).join("; ")}. Отвечай по-русски, ≤6 предложений, мягко, в стиле «ты», без токсичной продуктивности.`,
            userPrompt: input.content,
          });
          reply = typeof result === "string" ? result : String(result);
        } catch {
          reply = "Мягкий шаг: попробуй сейчас 15-минутный спринт по задаче №16. Если не идёт — перенеси на завтра, без чувства вины 🍵";
        }
      } else {
        reply = "Мягкий шаг: попробуй сейчас 15-минутный спринт по задаче №16. Если не идёт — перенеси на завтра, без чувства вины 🍵";
      }

      const mayaMessage = await appendChatMessage(ctx.userId, "maya", reply, { model: "anthropic/claude-3.5-sonnet" });
      return { ...mayaMessage, mode };
    }),
});