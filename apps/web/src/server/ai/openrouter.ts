/**
 * OpenRouter клиент. Phase 6 — Майя чат, Phase 3 — OCR.
 *
 * Активируется автоматически, когда OPENROUTER_API_KEY задан.
 * Без ключа модуль не импортируется (lazy).
 */

const BASE = "https://openrouter.ai/api/v1";

type ChatInput = {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Если задан — вернёт ReadableStream (server-sent events от OpenRouter). */
  stream?: boolean;
};

export async function openrouterChat({
  systemPrompt,
  userPrompt,
  model = "anthropic/claude-3.5-sonnet",
  temperature = 0.7,
  maxTokens = 800,
  stream = false,
}: ChatInput): Promise<string | ReadableStream<string>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.AUTH_URL ?? "http://localhost:3000",
      "X-Title": "ВайбПлан",
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      stream,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  }

  if (stream && res.body) {
    // OpenRouter SSE → преобразуем в стрим текста.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    return new ReadableStream<string>({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); return; }
        const chunk = decoder.decode(value, { stream: true });
        // OpenRouter SSE: lines like "data: {...}\n\n"
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") { controller.close(); return; }
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content;
            if (typeof delta === "string") controller.enqueue(delta);
          } catch { /* keep reading */ }
        }
      },
    });
  }

  const json = await res.json() as { choices: { message: { content: string } }[] };
  return json.choices[0]?.message?.content ?? "";
}

/** Vision-OCR: картинка + системный промпт. */
export async function openrouterVision({
  imageDataUrl,
  systemPrompt,
  model = "openai/gpt-4o-vision",
  temperature = 0.2,
  maxTokens = 1500,
}: {
  imageDataUrl: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.AUTH_URL ?? "http://localhost:3000",
      "X-Title": "ВайбПлан",
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Распознай расписание по этой картинке. Верни только JSON." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const json = await res.json() as { choices: { message: { content: string } }[] };
  return json.choices[0]?.message?.content ?? "";
}

/** Embeddings для семантического поиска по якорям памяти. */
export async function openrouterEmbedding(input: string, model = "openai/text-embedding-3-small"): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");
  const res = await fetch(`${BASE}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const json = await res.json() as { data: { embedding: number[] }[] };
  return json.data[0]?.embedding ?? [];
}