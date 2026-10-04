import { describe, expect, it } from "vitest";
import {
  APP_NAME,
  ANCHOR_CATEGORIES,
  DEFAULT_HABITS,
  FIPI_CATALOG,
  FIPI_PROF_MATH_2025_MODULES,
  MAYA_TONES,
  SESSION_KINDS,
  SUBJECT_CODES,
  SUBJECT_LABELS,
} from "../constants";

describe("Константы ВайбПлана", () => {
  it("APP_NAME — ВайбПлан", () => {
    expect(APP_NAME).toBe("ВайбПлан");
  });

  it("11 предметов ЕГЭ покрыты (включая базовую математику)", () => {
    expect(SUBJECT_CODES).toHaveLength(11);
    expect(SUBJECT_CODES).toContain("prof_math");
    expect(SUBJECT_CODES).toContain("math_base");
    expect(SUBJECT_CODES).toContain("russian");
    expect(SUBJECT_CODES).toContain("informatics");
  });

  it("у каждого предмета есть лейбл", () => {
    for (const code of SUBJECT_CODES) {
      expect(SUBJECT_LABELS[code]).toBeTruthy();
      expect(SUBJECT_LABELS[code].full.length).toBeGreaterThan(3);
    }
  });

  it("3 тона Майи описаны", () => {
    expect(MAYA_TONES).toEqual(["caring", "academic", "zen"]);
  });

  it("4 категории якорей памяти", () => {
    expect(ANCHOR_CATEGORIES).toEqual(["study", "rest", "sport", "creative"]);
  });

  it("7 видов сессий", () => {
    expect(SESSION_KINDS.length).toBeGreaterThanOrEqual(7);
    expect(SESSION_KINDS).toContain("pomodoro");
    expect(SESSION_KINDS).toContain("deep_sprint");
  });

  it("DEFAULT_HABITS содержит ожидаемые коды", () => {
    const codes = DEFAULT_HABITS.map((h) => h.code);
    expect(codes).toContain("water");
    expect(codes).toContain("matcha");
    expect(codes).toContain("breath_478");
  });

  it("ФИПИ 2025: 3 модуля в проф. математике, минимум 18 тем всего", () => {
    expect(FIPI_PROF_MATH_2025_MODULES.length).toBe(3);
    const codes: string[] = [];
    for (const m of FIPI_PROF_MATH_2025_MODULES) {
      for (const t of m.topics) codes.push(t.code);
    }
    expect(codes.length).toBeGreaterThanOrEqual(18);
    // Каждый topic.code — уникальная строка с номером
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("FIPI_CATALOG покрывает 3 предмета", () => {
    expect(FIPI_CATALOG.length).toBe(3);
    expect(FIPI_CATALOG.map((c) => c.subject)).toContain("prof_math");
    expect(FIPI_CATALOG.map((c) => c.subject)).toContain("russian");
    expect(FIPI_CATALOG.map((c) => c.subject)).toContain("informatics");
  });
});