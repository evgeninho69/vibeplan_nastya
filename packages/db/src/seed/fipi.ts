/**
 * Сид кодификаторов ФИПИ 2025 в Postgres.
 * Вызывается скриптом `pnpm db:seed` (см. scripts/seed.ts).
 */

import { db } from "../client";
import { egeModules, egeTopics } from "../schema";
import { FIPI_CATALOG, SUBJECT_LABELS } from "@vibeplan/shared";

export async function seedFipi() {
  let modulesCount = 0;
  let topicsCount = 0;

  for (const catalog of FIPI_CATALOG) {
    for (const mod of catalog.modules) {
      const [m] = await db
        .insert(egeModules)
        .values({
          subjectCode: catalog.subject,
          name: mod.name,
          sortOrder: modulesCount,
          fipiYear: catalog.year,
        })
        .onConflictDoNothing()
        .returning();
      const moduleRow = m ?? (await db.query.egeModules.findFirst({
        where: (t, { and, eq }) => and(eq(t.subjectCode, catalog.subject), eq(t.name, mod.name)),
      }));
      if (!moduleRow) continue;
      modulesCount++;

      for (const topic of mod.topics) {
        await db
          .insert(egeTopics)
          .values({
            subjectCode: catalog.subject,
            moduleId: moduleRow.id,
            code: topic.code,
            name: topic.name,
            fipiYear: catalog.year,
          })
          .onConflictDoNothing();
        topicsCount++;
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`[seed:fipi] inserted ${modulesCount} modules, ${topicsCount} topics across ${FIPI_CATALOG.length} subjects`);
  // eslint-disable-next-line no-console
  console.log(`[seed:fipi] subjects seeded:`, FIPI_CATALOG.map(c => SUBJECT_LABELS[c.subject].short));
}