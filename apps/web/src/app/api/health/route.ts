import { NextResponse } from "next/server";
import { DATA_MODE } from "@/server/trpc/data";
import { APP_NAME } from "@vibeplan/shared";

/** Простой healthcheck. Возвращает режим данных, версию приложения, текущее время. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: APP_NAME,
    version: "0.1.0",
    dataMode: DATA_MODE,
    dbConfigured: !!process.env.DATABASE_URL,
    redisConfigured: !!process.env.REDIS_URL,
    authConfigured: !!process.env.AUTH_SECRET,
    aiConfigured: !!process.env.OPENROUTER_API_KEY,
    now: new Date().toISOString(),
  });
}