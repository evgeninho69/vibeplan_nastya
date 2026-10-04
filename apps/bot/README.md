# Telegram-бот ВайбПлана

Этот пакет — TypeScript-скелет + документация для реального Telegram-бота, который будет написан на **Python + aiogram 3** (Phase 9).

## Архитектура

```
apps/bot-py/                    ← сюда кладём реальный Python-код бота
├── pyproject.toml
├── src/
│   ├── main.py                ← aiogram 3 Bot + polling/webhook
│   ├── handlers/
│   │   ├── start.py           ← /start + приветствие
│   │   ├── maya.py            ← /maya → прокси на WEB_INTERNAL_URL/api/trpc/chat.send
│   │   ├── vibe.py            ← /vibe → прокси на maya.regenerateVibe
│   │   └── anchor.py          ← /anchor <text> → profile.addAnchor
│   └── middlewares/
│       └── acl.py             ← проверка user_id ∈ whitelist (по умолчанию 429471588)
└── README.md
```

## Команды бота

- `/start` — приветствие + ссылка на `/today`.
- `/maya <сообщение>` — проксирует на `WEB_INTERNAL_URL/api/trpc/chat.send` (SSE-стриминг или JSON).
- `/vibe` — запрашивает вайб дня.
- `/anchor <факт>` — добавляет якорь в память Майи.
- Inline-кнопки: «Вайб дня», «Открыть Сегодня», «Спросить Майю».

## ACL

По умолчанию бот работает с `user_id === 429471588`. При добавлении новых пользователей — обновляется файл `~/.minimax/access-control.yaml` и код middleware.

## Конфигурация (env)

| Переменная | Описание |
|-----------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен от @BotFather (обязательно). Без токена бот не стартует. |
| `WEB_INTERNAL_URL` | URL Next.js (по умолчанию `http://localhost:3000`). |
| `TELEGRAM_WEBHOOK_URL` | Если задан, бот работает в webhook-режиме. Иначе — long-polling. |

## TypeScript-скелет (этот пакет)

`src/main.ts` содержит псевдокод на TypeScript, демонстрирующий логику. Он **не запускается** — реальный бот живёт в `apps/bot-py/` (создаётся отдельно).

Зачем TypeScript-скелет здесь:
1. Документация контракта (формат запросов к tRPC, ACL).
2. Сборка проходит — пакет не ломает общий pnpm install.
3. Когда будет реальный Python-бот, его можно проверить по этой спеке.