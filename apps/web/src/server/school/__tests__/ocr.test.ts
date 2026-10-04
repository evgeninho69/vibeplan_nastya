import { describe, expect, it } from "vitest";
import { ocrEnabled, parseScheduleFromText, parseScheduleFromStub } from "../ocr";

describe("OCR парсер (stub режим)", () => {
  it("определяет stub-режим по отсутствию OPENROUTER_API_KEY", () => {
    expect(ocrEnabled()).toBe(false);
  });

  it("парсит текстовое расписание по regex", async () => {
    const r = await parseScheduleFromText({
      fromText: "ЧТ\n1. Литература 08:30-09:15 каб. 304\n2. Алгебра 09:25-10:10 каб. 210",
      hint: "week",
    });
    expect(r.ok).toBe(true);
    expect(r.confidence).toBeGreaterThan(0.8);
    if (r.ok && r.result) {
      expect(r.result.week).toHaveLength(1);
      const [day] = r.result.week;
      expect(day?.day).toMatch(/Чт/i);
      expect(day?.lessons).toHaveLength(2);
      expect(day?.lessons[0]?.subjectRaw).toBe("Литература");
      expect(day?.lessons[0]?.room).toBe("каб. 304");
    }
  });

  it("возвращает ошибку если передан только image без API-ключа", async () => {
    const r = await parseScheduleFromText({
      fromImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
      hint: "week",
    });
    expect(r.ok).toBe(false);
  });

  it("stub возвращает 6 уроков на четверг", async () => {
    const r = await parseScheduleFromStub("2025-10-21");
    expect(r.source).toBe("stub");
    expect(r.week[0].lessons.length).toBeGreaterThanOrEqual(6);
    expect(r.week[0].lessons[0]?.startsAt).toMatch(/^\d{2}:\d{2}$/);
  });

  it("нормализует день недели в русскую короткую форму", async () => {
    const r = await parseScheduleFromText({
      fromText: "ПН\n1. Физика 09:00-09:45",
      hint: "week",
    });
    expect(r.ok).toBe(true);
    if (r.ok && r.result) {
      expect(r.result.week[0]?.day).toMatch(/Пн/i);
    }
  });
});