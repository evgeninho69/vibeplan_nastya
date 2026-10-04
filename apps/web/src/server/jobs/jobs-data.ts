/**
 * Вспомогательные data-функции для джобов. Те же сигнатуры, что в data.ts,
 * только без зависимости от tRPC.
 */
import { MOCK_USER } from "@vibeplan/db/mock";

const VIBES = [
  "«Маленький шаг ведёт к большой цели. Ты уже в пути.»",
  "«Спокойный шаг тоже ведёт к цели. Ты всё успеваешь.»",
  "«Сегодняшняя пауза — это завтрашняя сила. Дыши глубже.»",
  "«Ты не отстаёшь. Ты идёшь своим темпом, и это правильно.»",
  "«Мягкий фокус — это тоже фокус. Начни с 15 минут.»",
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]!; }

export async function listUsersWithLowEnergy(_days: number) {
  // В Phase 7 stub: возвращаем текущего mock-пользователя, если energy_today < 5.
  if (MOCK_USER.energyToday < 5) {
    return [{ userId: MOCK_USER.id, avgEnergy: MOCK_USER.energyToday }];
  }
  return [];
}

export async function generateAndSaveVibe() {
  // В Phase 7 stub: возвращает объект без записи в БД (mock-store тут не используется).
  return {
    userId: MOCK_USER.id,
    date: new Date().toISOString().slice(0, 10),
    quote: pick(VIBES),
    suggestion: "Майя: 5 мин дыхательной паузы, потом к задаче №16.",
    energyPred: 8,
    mood: pick(["soft", "focused", "creative"] as const),
  };
}

export async function generateAndSaveAntiBurnoutNudge(userId: string) {
  // В Phase 7 stub: эхо-объект.
  return {
    userId,
    title: "Мягкий день",
    suggestion: "Убери одну сложную задачу, добавь дыхательную паузу 4-7-8 между сессиями.",
    severity: "gentle" as const,
  };
}