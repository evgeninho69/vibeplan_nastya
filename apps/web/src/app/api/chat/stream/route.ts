import { NextRequest } from "next/server";
import { getProfile, listMemoryAnchors, getTodaySchedule, TODAY, appendChatMessage } from "@/server/trpc/data";

/**
 * Сервер-сен-эвенты стрим для чата Майи.
 * - stub: пишет canned-фразу по кусочкам (имитация стриминга).
 * - openrouter (OPENROUTER_API_KEY задан): стримит claude-3.5-sonnet посимвольно.
 */
export async function POST(req: NextRequest) {
  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  const content = body?.content;
  if (typeof content !== "string" || !content.trim()) {
    return new Response("Bad request", { status: 400 });
  }

  const userId = "00000000-0000-0000-0000-000000000001";
  const profile = await getProfile(userId);
  const anchors = await listMemoryAnchors(userId);
  const schedule = await getTodaySchedule(userId, TODAY);

  await appendChatMessage(userId, "user", content);

  const mode = process.env.OPENROUTER_API_KEY ? "openrouter" : "stub";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let full = "";

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        type: "meta",
        mode,
        model: "anthropic/claude-3.5-sonnet",
        energy: profile?.energyToday,
        anchorsUsed: anchors.slice(0, 5).map((a) => a.id),
        sessionsToday: schedule.sessions.length,
      })}\n\n`));

      try {
        if (mode === "openrouter") {
          const { openrouterChat } = await import("@/server/ai/openrouter");
          const result = await openrouterChat({
            systemPrompt: buildSystemPrompt(profile, anchors, schedule),
            userPrompt: content,
            stream: true,
          });
          if (typeof result === "string") {
            full = result;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: full })}\n\n`));
          } else {
            const reader = (result as ReadableStream<string>).getReader();
            while (true) {
              const { done, value: delta } = await reader.read();
              if (done) break;
              if (delta) {
                full += delta;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`));
              }
            }
          }
        } else {
          const canned = pickCanned(content);
          // Имитация стриминга: побуквенно с микропаузой.
          const words = canned.split(/(\s+)/);
          for (const part of words) {
            if (!part) continue;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: part })}\n\n`));
            full += part;
            await sleep(15 + Math.random() * 35);
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: (e as Error).message })}\n\n`));
      }

      await appendChatMessage(userId, "maya", full, { model: "anthropic/claude-3.5-sonnet" });
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", fullText: full })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function buildSystemPrompt(profile: unknown, anchors: { category: string; content: string }[], schedule: { sessions: { startsAt: string; title: string }[] }) {
  const p = profile as { name?: string; energyToday?: number; mayaTone?: string; mayaSoftness?: number };
  return `Ты Майя — эмпатичный AI-наставник для школьницы. Имя: ${p?.name ?? "Аня"}. Энергия сегодня: ${p?.energyToday ?? "—"}/10. Тон: ${p?.mayaTone ?? "caring"}. Мягкость дедлайнов: ${p?.mayaSoftness ?? 95}%. Якоря памяти: ${anchors.slice(0, 5).map((a) => `${a.category}: ${a.content}`).join("; ")}. Расписание сегодня: ${schedule.sessions.map((s) => `${s.startsAt} ${s.title}`).join("; ")}. Отвечай по-русски, ≤6 предложений, мягко, в стиле «ты», без токсичной продуктивности.`;
}

function pickCanned(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("план") || lower.includes("задач")) {
    return "Мягкий шаг: выбери одну задачу из кодификатора и разбери её на 15-минутные шаги. После первого шага — пауза с матчей ☕";
  }
  if (lower.includes("устал") || lower.includes("застрял")) {
    return "Если чувствуешь, что застряла — отложи на завтра. Пауза — это часть пути. Вайб дня мягкий, ничего страшного.";
  }
  return "Маленькая мысль: ты уже закрыла 28 тем из 34 по русскому. Осталось всего 6 — это одна учебная неделя. Не гора 🏔️";
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}