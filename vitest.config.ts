import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/** Vitest workspace config. Каждый пакет может добавить свой vitest.config. */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/*/src/**/*.test.ts", "apps/web/src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/__tests__/**", "**/*.d.ts", "**/migrations/**"],
    },
  },
  resolve: {
    alias: {
      "@vibeplan/shared": resolve(__dirname, "packages/shared/src/index.ts"),
      "@vibeplan/ui": resolve(__dirname, "packages/ui/src/index.ts"),
      "@vibeplan/db": resolve(__dirname, "packages/db/src/index.ts"),
    },
  },
});