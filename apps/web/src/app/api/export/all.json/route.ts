import { NextResponse } from "next/server";
import { MOCK_USER, MOCK_TODAY, MOCK_SESSIONS, MOCK_HABITS, MOCK_HABIT_LOGS, MOCK_ANCHORS, MOCK_VIBE } from "@vibeplan/db/mock";

/**
 * JSON-бэкап всех данных пользователя (GDPR/152-ФЗ export).
 * Включает профиль, сессии, привычки, якоря, вайбы.
 */
export async function GET() {
  const payload = {
    schema: "vibeplan-backup-v1",
    exportedAt: new Date().toISOString(),
    user: MOCK_USER,
    sessions: MOCK_SESSIONS,
    habits: { definitions: MOCK_HABITS, logs: MOCK_HABIT_LOGS },
    memoryAnchors: MOCK_ANCHORS,
    dailyVibe: MOCK_VIBE,
    today: MOCK_TODAY,
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="vibeplan-backup-${MOCK_TODAY}.json"`,
    },
  });
}