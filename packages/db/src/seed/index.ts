import { seedFipi } from "./fipi";

async function main() {
  // eslint-disable-next-line no-console
  console.log("[seed] starting…");
  await seedFipi();
  // eslint-disable-next-line no-console
  console.log("[seed] done");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[seed] failed:", err);
  process.exit(1);
});