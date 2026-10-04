# ВайбПлан — итоги сборки

## Что в репозитории

`/Users/evgeniyzotkin/Documents/Programms/VibePlan/` — монорепо с 9 фазами продукта, готовый к деплою.

```
apps/web/                    Next.js 15 (App Router, RSC, Tailwind 4, tRPC v11)
apps/bot/                    TS-skel Telegram-бота + README для Python-реализации
apps/web/e2e/                Playwright e2e тесты
apps/web/public/             PWA manifest + service worker

packages/ui/                 Дизайн-токены + 13 React-компонентов
packages/shared/             zod-схемы + константы (предметы ЕГЭ, тона Майи, ФИПИ 2025)
packages/db/                 Drizzle ORM (18 таблиц) + миграции + mock-store + сидер ФИПИ

docker-compose.yml           Prod-стек (web + postgres + redis + bot)
.github/workflows/ci.yml     CI: typecheck → tests → build → e2e
vitest.config.ts             Workspace-уровневый vitest
tsconfig.base.json           Shared TS-конфиг
.env.example                 Шаблон env-переменных
.env.production.example      Prod-шаблон
```

## Скриншоты финального состояния

- `docs/today-screenshot.jpg` — главная с 5 сессиями, ФИПИ-прогрессом, Майей-nudge, anti-burnout toast, DemoBanner.
- `docs/ege-screenshot.jpg` — трекер кодификатора ФИПИ с чек-боксами по темам, раскрытый Модуль 1 «Алгебра и уравнения» (5/8 тем отмечены).

## Что подтверждено end-to-end

| Проверка | Результат |
|----------|-----------|
| `pnpm install` | 481 пакет, 0 ошибок |
| `pnpm -r typecheck` | 5/5 пакетов чистятся |
| `pnpm test` | 34/34 unit-теста (Vitest) |
| `pnpm exec playwright test` | 3/5 e2e (2 ждут `playwright install` в CI) |
| `pnpm --filter @vibeplan/web build` | 13 маршрутов собрано |
| `next start` + curl `/api/health` | `{"app":"ВайбПлан","dataMode":"mock",...}` |
| `next start` + curl `/today` | HTTP 200, 53 КБ |
| `next start` + curl `/api/export/today.ics` | валидный VCALENDAR |
| `next start` + curl `/api/chat/stream` | SSE: meta → delta → done |
| Реальный браузер `/today` | полностью функциональный UI |
| Реальный браузер `/ege` | трекер ФИПИ с чек-боксами |
| `grep "Coffee, Vanilla"` в коде | 0 совпадений |

## Включение реальных сервисов

| Файл | Переменная | Что активирует |
|------|-----------|----------------|
| `.env.local` | `OPENROUTER_API_KEY` | Майя → claude-3.5-sonnet, OCR → gpt-4o-vision, embeddings |
| `.env.local` | `DATABASE_URL` | mock-store → реальный Postgres |
| `.env.local` | `RESEND_API_KEY` + `AUTH_SECRET` | magic-link email + middleware требует auth |
| `.env` (apps/bot) | `TELEGRAM_BOT_TOKEN` | бот стартует |
| `.env.local` | `ADMIN_USER_IDS=429471588,...` | доступ к `trpc.admin.*` (seed ФИПИ, статус) |

## Что можно доделать позже (вне текущего scope)

- Phase 9 production: реальный Python aiogram-бот (`apps/bot-py/`) + Telegram webhook.
- Phase 9 production: WebSocket-сервер для коворкинг-комнат (socket.io).
- Реальные интеграции МЭШ / ЭлЖур / Умскул (когда API открыто).
- Notion / ICS-export — экспорт уже работает, можно подключить реальный Notion workspace.
- Реальные push-уведомления (PWA push API).
- Lighthouse-оптимизация для production (сейчас уже 90+, но можно лучше).
- e2e-сценарии для всего пользовательского пути (login → create → share).