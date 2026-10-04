/**
 * Standalone мигратор для случая, когда DATABASE_URL задан, но не хочется
 * гонять drizzle-kit CLI в контейнере. Использует предсобранные SQL из ./migrations.
 *
 * Запуск: pnpm tsx packages/db/scripts/migrate.ts
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL не задан — пропускаю. Mock-store активен.");
    process.exit(0);
  }
  console.log(`[migrate] подключаюсь к ${url.replace(/:[^:@]+@/, ":***@")}…`);
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);
  console.log("[migrate] применяю миграции из packages/db/migrations…");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("[migrate] ✓ миграции применены успешно");
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("[migrate] ✗ ошибку:", e);
  process.exit(1);
});