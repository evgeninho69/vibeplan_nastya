import { test, expect } from "@playwright/test";

test.describe("/today (главный экран)", () => {
  test("рендерит вайб дня и план", async ({ page }) => {
    await page.goto("/today");
    await expect(page).toHaveTitle(/ВайбПлан/);
    await expect(page.getByRole("heading", { name: /План на день/i })).toBeVisible();
    await expect(page.getByText(/мягкий фокус|мягкий/)).toBeVisible();
  });

  test("навигация в sidebar открывает Школу", async ({ page }) => {
    await page.goto("/today");
    await page.getByRole("link", { name: /Школа/ }).first().click();
    await expect(page).toHaveURL(/\/school/);
    await expect(page.getByText(/Школьное расписание/i)).toBeVisible();
  });
});

test.describe("/api/health", () => {
  test("отвечает JSON со статусом приложения", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.app).toBe("ВайбПлан");
    expect(json.dataMode).toMatch(/mock|postgres/);
  });
});

test.describe("tRPC эндпоинты", () => {
  test("profile.me возвращает mock-профиль Ани", async ({ request }) => {
    const res = await request.get("/api/trpc/profile.me?batch=1&input=" + encodeURIComponent('{"0":{"json":null,"meta":{"values":["undefined"]}}}'));
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body[0].result.data.json.name).toBe("Аня");
  });

  test("habits.list возвращает 7 привычек", async ({ request }) => {
    const res = await request.get("/api/trpc/habits.list?batch=1&input=" + encodeURIComponent('{"0":{"json":null,"meta":{"values":["undefined"]}}}'));
    const body = await res.json();
    expect(body[0].result.data.json.length).toBeGreaterThanOrEqual(7);
  });
});