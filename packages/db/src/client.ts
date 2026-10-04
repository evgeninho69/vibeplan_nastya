import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://vibeplan:vibeplan@localhost:5432/vibeplan";

/** Singleton клиент БД для Node-runtime. Для Edge используйте Neon HTTP. */
declare global {
  // eslint-disable-next-line no-var
  var __vp_pg__: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__vp_pg__ ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 5,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__vp_pg__ = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;