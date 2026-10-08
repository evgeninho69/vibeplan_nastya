/**
 * Google Gemini API клиент.
 * Активируется автоматически при GOOGLE_API_KEY в env.
 * Имеет те же интерфейсы, что и openrouter.ts (chat + stream + embeddings),
 * чтобы data-слой мог переключаться прозрачно.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY ?? "";
const model = process.env.PRIMARY_MODEL?.startsWith("google/")
  ? process.env.PRIMARY_MODEL.replace("google/", "")
  : "gemini-3.8-flash";
const embeddingModel = "text-embedding-004";

let _client: GoogleGenerativeAI | null = null;
function client(): GoogleGenerativeAI {
  if (!apiKey) throw new Error("GOOGLE_API_KEY не задан");
  if (!_client) _client = new GoogleGenerativeAI(apiKey);
  return _client;
}

export const geminiEnabled = (): boolean => Boolean(apiKey);

type ChatInput = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
};

/** Обычный (не-стримящий) ответ. Возвращает string. */
export async function geminiChat({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 800,
}: ChatInput): Promise<string> {
  const m = client().getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  });
  const result = await m.generateContent(userPrompt);
  return result.response.text();
}

/** Стримящий ответ — возвращает ReadableStream<string> для SSE. */
export function geminiChatStream({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 800,
}: Omit<ChatInput, "stream">): ReadableStream<string> {
  const m = client().getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  });
  const encoder = new TextEncoder();
  return new ReadableStream<string>({
    async start(controller) {
      try {
        const result = await m.generateContentStream(userPrompt);
        for await (const chunk of result.stream) {
          // chunk.text() возвращает string; на некоторых версиях типов TS не резолвит правильно.
          const raw = (chunk as { text?: () => string }).text?.() ?? "";
          if (raw) controller.enqueue(String(raw));
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

/** Embeddings — вектор длины 768 (text-embedding-004) или 3072 (text-embedding-3). */
export async function geminiEmbedding(input: string): Promise<number[]> {
  const m = client().getGenerativeModel({ model: embeddingModel });
  const result = await m.embedContent(input);
  const values = result.embedding?.values ?? [];
  // Привести к 1536 (как ожидает наша схема) через pad/truncate.
  const target = 1536;
  if (values.length === target) return values;
  if (values.length > target) return values.slice(0, target);
  return [...values, ...new Array(target - values.length).fill(0)];
}

/** Vision OCR — картинка + prompt, ответ текстом (для парсинга расписания). */
export async function geminiVision({
  imageDataUrl,
  prompt,
  modelName,
}: {
  imageDataUrl: string;
  prompt: string;
  modelName?: string;
}): Promise<string> {
  const m = client().getGenerativeModel({
    model: modelName ?? "gemini-2.5-flash",
  });
  // imageDataUrl: "data:image/png;base64,iVBORw0KGgo..."
  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) throw new Error("imageDataUrl должен быть data URL с base64");
  const result = await m.generateContent([
    { inlineData: { mimeType: match[1]!, data: match[2]! } },
    prompt,
  ]);
  return result.response.text();
}