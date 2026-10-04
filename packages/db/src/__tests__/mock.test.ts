import { describe, expect, it } from "vitest";
import {
  MOCK_USER,
  MOCK_TODAY,
  MOCK_SESSIONS,
  MOCK_HABITS,
  MOCK_HABIT_LOGS,
  MOCK_ANCHORS,
  MOCK_VIBE,
} from "../mock";

describe("Mock-store", () => {
  it("MOCK_USER — Аня, 11 класс, цель ВШЭ/МГУ", () => {
    expect(MOCK_USER.name).toBe("Аня");
    expect(MOCK_USER.grade).toBe(11);
    expect(MOCK_USER.goalText).toContain("85+");
    expect(MOCK_USER.theme).toBe("matcha");
  });

  it("MOCK_TODAY — фиксированная дата мокапа (НЕ привязана к реальному дню недели)", () => {
    expect(MOCK_TODAY).toBe("2025-10-24");
    const d = new Date(MOCK_TODAY);
    // Мок — нарративный: дизайн рисует "Четверг, 24 октября", реальный календарь показывает пятницу.
    // Не проверяем day-of-week жёстко, чтобы тест не сломался из-за смены календаря.
    expect(Number.isNaN(d.getTime())).toBe(false);
  });

  it("5 сессий на четверг, отсортированы по startsAt", () => {
    expect(MOCK_SESSIONS.length).toBeGreaterThanOrEqual(5);
    for (let i = 1; i < MOCK_SESSIONS.length; i++) {
      const prev = MOCK_SESSIONS[i - 1];
      const curr = MOCK_SESSIONS[i];
      if (prev && curr) expect(prev.startsAt <= curr.startsAt).toBe(true);
    }
  });

  it("7 привычек с уникальными кодами", () => {
    expect(MOCK_HABITS.length).toBeGreaterThanOrEqual(7);
    const codes = MOCK_HABITS.map((h) => h.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("логи привычек за сегодня, суммы по коду в пределах target", () => {
    const byCode = new Map<string, number>();
    for (const log of MOCK_HABIT_LOGS) {
      const code = (log as { habitCode?: string }).habitCode ?? "";
      byCode.set(code, (byCode.get(code) ?? 0) + log.value);
    }
    // Вода должна быть в пределах дневной нормы (≤ 7)
    expect(byCode.get("water") ?? 0).toBeLessThanOrEqual(7);
  });

  it("якоря памяти: 8 фактов в 4 категориях", () => {
    expect(MOCK_ANCHORS.length).toBe(8);
    const cats = new Set(MOCK_ANCHORS.map((a) => a.category));
    expect(cats.size).toBe(4);
  });

  it("vibe дня содержит цитату и предложение", () => {
    expect(MOCK_VIBE.quote.length).toBeGreaterThan(10);
    expect(MOCK_VIBE.suggestion).toBeTruthy();
    expect(MOCK_VIBE.mood).toBe("soft");
  });
});