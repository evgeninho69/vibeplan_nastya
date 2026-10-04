import { describe, expect, it } from "vitest";
import {
  profileSchema,
  sessionSchema,
  lessonSchema,
  anchorSchema,
  mayaMessageSchema,
  topicProgressSchema,
  habitLogSchema,
} from "../schemas";

describe("Zod-схемы", () => {
  describe("profileSchema", () => {
    it("принимает валидный профиль", () => {
      const r = profileSchema.safeParse({
        name: "Аня",
        grade: 11,
        goalText: "85+",
        antiBurnout: true,
        energyToday: 7,
        mayaTone: "caring",
        mayaSoftness: 95,
        mayaModel: "anthropic/claude-3.5-sonnet",
        theme: "matcha",
        tz: "Europe/Moscow",
      });
      expect(r.success).toBe(true);
    });

    it("отвергает энергию вне диапазона 0..10", () => {
      const r = profileSchema.safeParse({ name: "A", energyToday: 11 });
      expect(r.success).toBe(false);
    });

    it("отвергает неверный tone", () => {
      const r = profileSchema.safeParse({ name: "A", mayaTone: "aggressive" });
      expect(r.success).toBe(false);
    });
  });

  describe("sessionSchema", () => {
    it("принимает полную сессию", () => {
      const r = sessionSchema.safeParse({
        date: "2025-10-24",
        kind: "pomodoro",
        startsAt: "15:30",
        endsAt: "17:30",
        title: "Проф. математика",
        subjectCode: "prof_math",
      });
      expect(r.success).toBe(true);
    });

    it("отвергает битый формат времени", () => {
      const r = sessionSchema.safeParse({
        date: "2025-10-24",
        kind: "study",
        startsAt: "25:99",
        endsAt: "16:00",
        title: "X",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("anchorSchema", () => {
    it("принимает категорию + контент", () => {
      const r = anchorSchema.safeParse({
        category: "sport",
        content: "Гребля по чт 19:30",
        source: "voice",
        confidence: 95,
      });
      expect(r.success).toBe(true);
    });

    it("отвергает неизвестную категорию", () => {
      const r = anchorSchema.safeParse({
        category: "weather",
        content: "X",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("mayaMessageSchema", () => {
    it("требует непустой content ≤ 4000", () => {
      expect(mayaMessageSchema.safeParse({ content: "" }).success).toBe(false);
      expect(mayaMessageSchema.safeParse({ content: "x".repeat(4001) }).success).toBe(false);
      expect(mayaMessageSchema.safeParse({ content: "Привет!" }).success).toBe(true);
    });
  });

  describe("topicProgressSchema", () => {
    it("принимает статус completed", () => {
      const r = topicProgressSchema.safeParse({
        topicId: "00000000-0000-0000-0000-000000000000",
        status: "completed",
        confidence: 80,
        solvedCount: 5,
      });
      expect(r.success).toBe(true);
    });

    it("отвергает неизвестный статус", () => {
      const r = topicProgressSchema.safeParse({
        topicId: "00000000-0000-0000-0000-000000000000",
        status: "yolo",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("habitLogSchema", () => {
    it("принимает валидный лог", () => {
      const r = habitLogSchema.safeParse({
        habitCode: "water",
        date: "2025-10-24",
        value: 1,
      });
      expect(r.success).toBe(true);
    });
  });

  describe("lessonSchema", () => {
    it("принимает урок школы", () => {
      const r = lessonSchema.safeParse({
        date: "2025-10-24",
        number: 1,
        startsAt: "08:30",
        endsAt: "09:15",
        subjectRaw: "Литература",
        room: "304",
        done: false,
      });
      expect(r.success).toBe(true);
    });

    it("отвергает урок с отрицательным номером", () => {
      const r = lessonSchema.safeParse({
        date: "2025-10-24",
        number: 0,
        startsAt: "08:30",
        endsAt: "09:15",
        subjectRaw: "Литература",
        done: false,
      });
      expect(r.success).toBe(false);
    });
  });
});