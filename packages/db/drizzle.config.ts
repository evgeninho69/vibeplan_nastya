import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://vibeplan:vibeplan@localhost:5432/vibeplan",
  },
  verbose: true,
  strict: true,
  migrations: {
    // Использовать предсобранные SQL в migrations/, а не генерировать на лету.
    table: "__drizzle_migrations",
    schema: "public",
  },
});