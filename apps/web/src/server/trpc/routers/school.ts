/**
 * Школа — уроки, домашка, OCR-расписание.
 * Phase 3 добавляет scanSchedule (multipart upload + OpenRouter gpt-4o-vision).
 * Сейчас — стаб, который возвращает «как будто OCR прошёл».
 */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { parseScheduleFromText, parseScheduleFromStub, ocrEnabled } from "@/server/school/ocr";

export const schoolRouter = router({
  /** Текущее расписание школы на неделю (стаб — мокап). */
  week: publicProcedure
    .input(z.object({ fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(({ input }) => parseScheduleFromStub(input?.fromDate ?? "2025-10-21")),

  /** OCR-парсинг расписания.
   * В stub-режиме принимает текст напрямую (например, вставленный из дневника).
   * В проде (OPENROUTER_API_KEY задан) — принимает base64-картинку, шлёт в gpt-4o-vision. */
  scan: publicProcedure
    .input(z.object({
      /** Либо text, либо imageDataUrl. */
      text: z.string().optional(),
      imageDataUrl: z.string().regex(/^data:image\/(jpeg|png|webp|heic);base64,/).optional(),
      hint: z.enum(["week", "day"]).default("week"),
    }))
    .mutation(async ({ input }) => {
      if (input.imageDataUrl) {
        if (!ocrEnabled()) {
          return {
            ok: false as const,
            reason: "OCR не настроен — добавь OPENROUTER_API_KEY в .env.local",
            confidence: 0,
          };
        }
        return parseScheduleFromText({ fromImage: input.imageDataUrl, hint: input.hint });
      }
      if (input.text) {
        return parseScheduleFromText({ fromText: input.text, hint: input.hint });
      }
      return { ok: false as const, reason: "Нужен text или imageDataUrl", confidence: 0 };
    }),
});