/**
 * TypeScript-скелет Telegram-бота ВайбПлана.
 *
 * Реальная имплементация — на Python + aiogram 3 (см. apps/bot/README.md).
 * Этот файл существует как документация контракта: какие tRPC-эндпоинты
 * дёргает бот, какие переменные нужны, какой ACL.
 *
 * Запускать не нужно — он не компилируется в исполняемое.
 */

import { MENTOR_NAME, APP_NAME } from "@vibeplan/shared";

type TgUpdate = {
  update_id: number;
  message?: { from: { id: number; username?: string }; text?: string };
  callback_query?: { data: string; from: { id: number } };
};

const WEB = process.env.WEB_INTERNAL_URL ?? "http://localhost:3000";
const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const ALLOWED = new Set([429471588]);

function allowed(userId: number): boolean { return ALLOWED.has(userId); }

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

async function trpcPost(path: string, input: unknown) {
  const res = await fetch(`${WEB}/api/trpc/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`tRPC ${path} ${res.status}`);
  return res.json();
}

// --- handlers ---

async function handleStart(msg: TgUpdate["message"]) {
  if (!msg || !allowed(msg.from.id)) return;
  await sendMessage(msg.from.id,
    `Привет! Я ${MENTOR_NAME}, ${APP_NAME}-бот 🌿\n` +
    `Открой расписание: ${WEB}/today\n\n` +
    `/maya <сообщение> · /vibe — вайб дня · /anchor <факт>`);
}

async function handleMaya(msg: TgUpdate["message"], text: string) {
  if (!msg || !allowed(msg.from.id)) return;
  const json = await trpcPost("chat.send", { json: { content: text } });
  const reply = (json as { result?: { data?: { json?: { content?: string } } } }).result?.data?.json?.content ?? "...";
  await sendMessage(msg.from.id, reply);
}

async function handleVibe(msg: TgUpdate["message"]) {
  if (!msg || !allowed(msg.from.id)) return;
  const json = await trpcPost("maya.regenerateVibe", { json: null, meta: { values: ["undefined"] } });
  const vibe = (json as { result?: { data?: { json?: { quote?: string; suggestion?: string } } } }).result?.data?.json;
  await sendMessage(msg.from.id, `${vibe?.quote ?? ""}\n\n${vibe?.suggestion ?? ""}`);
}

async function handleAnchor(msg: TgUpdate["message"], text: string) {
  if (!msg || !allowed(msg.from.id)) return;
  await trpcPost("profile.addAnchor", { json: { category: "study", content: text, source: "voice" } });
  await sendMessage(msg.from.id, "Запомнила. Этот факт теперь в памяти Майи 🌿");
}

// --- polling loop (для справки) ---

async function pollLoop() {
  let off_ = 0;
  while (true) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${off_}&timeout=30`);
    const json = (await res.json()) as { result: TgUpdate[] };
    for (const u of json.result) {
      off_ = u.update_id + 1;
      if (u.message?.text?.startsWith("/start")) await handleStart(u.message);
      else if (u.message?.text?.startsWith("/maya")) await handleMaya(u.message, u.message.text.replace(/^\/maya\s*/, "").trim());
      else if (u.message?.text?.startsWith("/vibe")) await handleVibe(u.message);
      else if (u.message?.text?.startsWith("/anchor")) await handleAnchor(u.message, u.message.text.replace(/^\/anchor\s*/, "").trim());
    }
  }
}

// Реальная имплементация: см. apps/bot-py/src/main.py (Python + aiogram 3).

console.log(`[bot-skel] ${APP_NAME} Telegram-bot scaffold — реальный код в apps/bot-py/`);
console.log(`[bot-skel] WEB=${WEB}, TOKEN=${TOKEN ? "***set***" : "not set"}`);
export { handleStart, handleMaya, handleVibe, handleAnchor, pollLoop };