/**
 * OCR-расписания. Phase 3.
 *
 * Два режима:
 * - ocrEnabled() === false → заглушка, возвращает стаб JSON «как будто OCR прошёл».
 *   Это чтобы UI мог работать локально без OpenRouter API-ключа.
 * - ocrEnabled() === true → шлёт в OpenRouter (gpt-4o-vision), парсит ответ через zod,
 *   возвращает структурированное расписание для диффа с текущим.
 */
import { ocrScheduleSchema, type OcrScheduleResult } from "@vibeplan/shared";

export function ocrEnabled(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 10);
}

type Args = {
  fromText?: string;
  fromImage?: string; // data URL
  hint: "week" | "day";
};

/** Заглушка, которую использует UI в stub-режиме. */
export async function parseScheduleFromStub(fromDate: string): Promise<{
  week: { day: string; lessons: { number: number; startsAt: string; endsAt: string; subjectRaw: string; room: string | null }[] }[];
  source: "stub";
  fromDate: string;
}> {
  return {
    source: "stub",
    fromDate,
    week: [
      {
        day: "Чт",
        lessons: [
          { number: 1, startsAt: "08:30", endsAt: "09:15", subjectRaw: "Литература",  room: "304" },
          { number: 2, startsAt: "09:25", endsAt: "10:10", subjectRaw: "Алгебра",     room: "210" },
          { number: 3, startsAt: "10:25", endsAt: "11:10", subjectRaw: "Обществознание", room: "108" },
          { number: 4, startsAt: "11:30", endsAt: "12:15", subjectRaw: "Английский",  room: "402" },
          { number: 5, startsAt: "12:35", endsAt: "13:20", subjectRaw: "История",     room: "301" },
          { number: 6, startsAt: "13:30", endsAt: "14:15", subjectRaw: "Информатика", room: "215" },
        ],
      },
    ],
  };
}

/** Реальный парсинг (через OpenRouter в проде, текстовый fallback — для дев). */
export async function parseScheduleFromText(args: Args): Promise<{
  ok: boolean;
  result?: OcrScheduleResult;
  confidence: number;
  rawText?: string;
  reason?: string;
}> {
  // В Phase 3 stub-режим: парсим текстовый ввод детерминированно.
  if (!ocrEnabled() && args.fromText) {
    const lines = args.fromText.split("\n").map((l) => l.trim()).filter(Boolean);
    const day = lines[0]?.match(/пн|вт|ср|чт|пт|сб|вс/i)?.[0]?.toUpperCase().replace("ЧТ", "Чт").replace("ПН", "Пн").replace("ВТ", "Вт").replace("СР", "Ср").replace("ПТ", "Пт").replace("СБ", "Сб").replace("ВС", "Вс") ?? "Чт";
    const lessons = lines.slice(1).map((l, idx) => {
      const m = l.match(/^(\d+)\.\s*(.+?)\s+(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})(?:\s+(.+))?$/);
      if (!m) return null;
      const [, number, subject, startsAt, endsAt, room] = m;
      return { number: Number(number), startsAt, endsAt, subjectRaw: subject.trim(), room: room?.trim() ?? null };
    }).filter(Boolean) as { number: number; startsAt: string; endsAt: string; subjectRaw: string; room: string | null }[];
    return {
      ok: true,
      confidence: 0.92,
      result: ocrScheduleSchema.parse({
        week: [{ day, lessons }],
        confidence: 0.92,
        rawText: args.fromText,
      }),
    };
  }

  if (ocrEnabled() && args.fromImage) {
    // Real OpenRouter call.
    try {
      const { openrouterVision } = await import("@/server/ai/openrouter");
      const raw = await openrouterVision({
        imageDataUrl: args.fromImage,
        systemPrompt: `Ты парсер школьного расписания. Верни СТРОГО JSON по схеме:
{week: [{day: 'Пн'|'Вт'|'Ср'|'Чт'|'Пт'|'Сб'|'Вс', lessons: [{number, startsAt: 'HH:MM', endsAt: 'HH:MM', subjectRaw, room: string|null}]}], confidence: 0..1, rawText?: string}
Не додумывай то, чего не видишь. Если поле нечитаемо — null.`,
        model: process.env.VISION_MODEL ?? "openai/gpt-4o-vision",
      });
      const parsed = ocrScheduleSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        return { ok: false, confidence: 0, reason: "Невалидный JSON от модели", rawText: raw };
      }
      return { ok: true, result: parsed.data, confidence: parsed.data.confidence };
    } catch (e) {
      return { ok: false, confidence: 0, reason: `OpenRouter error: ${(e as Error).message}` };
    }
  }

  return { ok: false, confidence: 0, reason: "Нет данных для парсинга" };
}