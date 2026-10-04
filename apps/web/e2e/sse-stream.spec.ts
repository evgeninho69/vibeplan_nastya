import { test, expect } from "@playwright/test";

/**
 * Проверяет, что live-данные /today подгружаются через tRPC.
 * Этот тест работает в Playwright (browser), поэтому требует `playwright install`.
 */
test.describe("SSE + live data на /today", () => {
  test("today.getSchedule возвращает 5 сессий через tRPC", async ({ request }) => {
    const res = await request.get(
      "/api/trpc/today.getSchedule?batch=1&input=" +
        encodeURIComponent('{"0":{"json":{"date":"2025-10-24"}}}')
    );
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const sessions = body[0].result.data.json.sessions;
    expect(sessions.length).toBe(5);
    expect(sessions[0].title).toContain("Школа");
    expect(sessions[1].title).toContain("Профильная математика");
  });

  test("maya.status возвращает stub-режим без API-ключа", async ({ request }) => {
    const res = await request.get(
      "/api/trpc/maya.status?batch=1&input=" +
        encodeURIComponent('{"0":{"json":null,"meta":{"values":["undefined"]}}}')
    );
    const body = await res.json();
    expect(body[0].result.data.json.mode).toBe("stub");
    expect(body[0].result.data.json.model).toContain("claude");
  });

  test("POST /api/chat/stream отдаёт SSE с meta + delta событиями", async ({ request }) => {
    const res = await request.post("/api/chat/stream", {
      headers: { "Content-Type": "application/json" },
      data: { content: "привет" },
    });
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("text/event-stream");
    const text = await res.text();
    // meta-event первый
    expect(text).toMatch(/data: \{"type":"meta"/);
    // хотя бы один delta
    expect(text).toMatch(/data: \{"type":"delta"/);
    // done-event последний
    expect(text).toMatch(/data: \{"type":"done"/);
  });

  test("POST /api/chat/stream с пустым content → 400", async ({ request }) => {
    const res = await request.post("/api/chat/stream", {
      headers: { "Content-Type": "application/json" },
      data: { content: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/chat/stream с битым JSON → 400", async ({ request }) => {
    const res = await request.post("/api/chat/stream", {
      headers: { "Content-Type": "application/json" },
      data: "not-valid-json",
    });
    expect(res.status()).toBe(400);
  });
});