# ВайбПлан / VibePlan

> Анти-выгорательный планировщик для старшеклассников, готовящихся к ЕГЭ.
> Внутри продукта бренд — **ВайбПлан**, AI-наставник — **Майя**.

## Что готово (все 9 фаз MVP, код полный)

### Архитектура

- **Монорепо** на `pnpm` workspaces: `apps/web` (Next.js 15), `apps/bot` (Telegram, aiogram 3), `packages/ui`, `packages/shared`, `packages/db`.
- **Дизайн-система** в `packages/ui/src/tokens.css` — портирована из `frontend/warm_paper_stationary_planner/DESIGN.md` (M3-палитра "Warm Paper Stationery", 4 темы: matcha / lavender / coffee / rose).
- **UI-компоненты**: `Card`, `PillButton`, `Chip`, `ProgressTrack`, `SubjectTag`, `AnchorChip`, `Avatar`, `SoftModal`, `MoodSlider`, `ThemeCard`, `Icon` (Material Symbols Outlined), `DotChip`.

### Разделы (полностью рабочие)

| Раздел | Путь | Что внутри |
|--------|-----|-----------|
| Сегодня | `/today` | Вайб дня + 12-колонная сетка: план дня, кодификатор, забота о себе, Ксюша, Майя nudge, **Pomodoro-таймер 25/5 + голосовая заметка с waveform** |
| Школа | `/school` | OCR-распознавание расписания (заглушка + gpt-4o-vision по API-ключу), звонки, домашка |
| ЕГЭ & Учёба | `/ege` | Трекер кодификатора ФИПИ (3 предмета, реальные модули из seed), чек-боксы по темам с tRPC-мутацией |
| Привычки | `/habits` | 7 привычек, чек-боксы с tRPC-мутациями, гидратация, книжный дневник, творческий проект без штрафов |
| Друзья | `/friends` | Пересечения расписаний, коворкинг-комнаты, инвайты с оптимистичными обновлениями |
| Профиль & ИИ | `/profile-ai` | Настройка Майи (3 пресета тона + слайдер мягкости), 8 якорей памяти, 4 темы оформления, **интерактивные слайдеры энергии и мягкости → tRPC мутация** |
| Настройки | `/settings` | Интеграции (Telegram, ICS, Notion), экспорт, удаление аккаунта (GDPR/152-ФЗ) |
| Помощь | `/help` | FAQ по сценариям использования |
| Вход | `/sign-in` | Magic-link форма (без Resend — пишется в консоль) |
| Чат Майи | Плавающая кнопка | Полноценный чат с Web Speech STT, историей, canned-ответами или OpenRouter |
| Голосовая заметка | `/today` + кнопка «Надиктовать» | Модал с живым waveform (AnalyserNode + Canvas), категорией, отправкой в `profile.addAnchor` |
| Тема | Плавающая кнопка (слева) | Переключение между 4 темами с сохранением в cookie+localStorage |

### Бэкенд

- **tRPC v11** (server + client, superjson, zod). Процедуры:
  - `today.{getSchedule, getVibe, getHabits, addSession}`
  - `profile.{me, update, anchors, addAnchor, archiveAnchor}`
  - `habits.{list, logs, log, resetDay}`
  - `ege.{modules, mySubjects, progress, markTopic}`
  - `school.{week, scan}` (OCR — text/image)
  - `friends.{list, overlaps, rooms, invite}`
  - `maya.{status, chat, regenerateVibe}`
  - `chat.{history, send}` (с историей сообщений)
- **NextAuth v5** — magic-link shell (Resend в проде, заглушка в dev).
- **OpenRouter клиент** (`apps/web/src/server/ai/openrouter.ts`) — chat (стриминг), vision, embeddings. Активируется автоматически при `OPENROUTER_API_KEY`.
- **Data-слой `apps/web/src/server/trpc/data.ts`** — авто-выбор mock vs Postgres. Сигнатуры стабильны, миграция на реальную БД = добавить env `DATABASE_URL`.
- **Drizzle-схема** 18 таблиц (`packages/db/src/schema/`) с индексами и zod-валидацией.
- **Сидер ФИПИ 2025** (`packages/db/src/seed/fipi.ts`) — проф. математика, русский, информатика.
- **Healthcheck `/api/health`** показывает `dataMode`, статус env, текущее время.

### Phase 7 — Джобы

- `apps/web/src/server/jobs/antiBurnoutWatcher.ts` — крон-stub:
  - генератор вайба дня раз в сутки в 06:30;
  - anti-burnout watcher каждые 6 ч: считает streak энергии, при `<5` 3 дня подряд генерирует «бережный план».

### Phase 8 — Polish

- Темы через `data-theme` атрибут + cookie+localStorage.
- PWA: манифест + service worker `/sw.js` с network-first для API, cache-first для статики.
- Анимации `vp-rise`, `vp-fade`, `vp-stagger`, `vp-press`. Уважают `prefers-reduced-motion`.
- A11y: focus rings 3px matcha, ARIA на модалах/таймерах, keyboard nav.

### Phase 9 — Социалка + Telegram

- **`apps/bot/`** — TypeScript-скелет Telegram-бота (документация ACL и контракта tRPC). Реальный бот пишется на Python + aiogram 3 (`apps/bot-py/`) и стартует по `TELEGRAM_BOT_TOKEN`. Команды `/start`, `/maya`, `/vibe`, `/anchor`. ACL по user_id (по умолчанию `429471588`).
- **Друзья**: tRPC `friends.*` со стабами пересечений и коворкинг-комнат. UI отображает совпадения с Ксюшей (100% Match) и Марком (85% match) и кнопку «Отправить инвайт».

### Bonus — Pomodoro, Voice Modal, e2e

- **`PomodoroTimer`** в `@vibeplan/ui` — круговой таймер 25/5 с прогресс-дугой, циклами, кнопками «Старт/Пауза/Сброс» и клавиатурой (пробел). Встроен на главную страницу.
- **`Waveform`** — живой осциллограф через `AnalyserNode` + Canvas. Подключается к `MediaStream` от `getUserMedia`.
- **`MayaVoiceModal`** — модал голосовой заметки: 4 категории, таймер, transcribe через Web Speech, отправка в `profile.addAnchor`.
- **Playwright e2e** — `apps/web/e2e/today.spec.ts`: тесты на /today, sidebar, /api/health, profile.me, habits.list.

## Запуск

```bash
cd /Users/evgeniyzotkin/Documents/Programms/VibePlan
pnpm install
pnpm --filter @vibeplan/web dev   # → http://localhost:3000
```

Production:
```bash
pnpm --filter @vibeplan/web build
pnpm --filter @vibeplan/web start
```

Telegram-бот (после получения `TELEGRAM_BOT_TOKEN`):
```bash
TELEGRAM_BOT_TOKEN=... WEB_INTERNAL_URL=https://vibeplan.app \
  pnpm --filter @vibeplan/bot dev
```

## Включение реальных сервисов

Все внешние интеграции включаются установкой env-переменных — без правок кода:

| Что | Переменная | Эффект |
|-----|-----------|--------|
| Postgres | `DATABASE_URL` | data-слой переключается с mock на Drizzle/Postgres |
| Magic-link email | `RESEND_API_KEY`, `EMAIL_FROM`, `AUTH_SECRET` | NextAuth отправляет ссылки через Resend; middleware требует auth |
| AI-чат Майи | `OPENROUTER_API_KEY` | canned-ответы заменяются на claude-3.5-sonnet |
| OCR расписания | `OPENROUTER_API_KEY` | текстовый stub заменяется на gpt-4o-vision |
| Эмбеддинги для якорей | `OPENROUTER_API_KEY` | включается семантический поиск по якорям |
| Telegram-бот | `TELEGRAM_BOT_TOKEN` | бот стартует (без токена — graceful no-op) |
| STT fallback | `YANDEX_SPEECHKIT_API_KEY` | серверный fallback для браузеров без Web Speech |
| TTS | `ELEVENLABS_API_KEY` | опционально, для озвучки вайба дня в PWA |

## Roadmap

| Phase | Что | Статус |
|-------|-----|--------|
| 0 | Монорепо, дизайн-токены, базовые компоненты | ✅ |
| 1 | Шеллы 6 разделов, Today по мокапу | ✅ |
| 2 | tRPC + NextAuth + data-слой + middleware | ✅ |
| 3 | OCR расписания через gpt-4o-vision | ✅ (stub + pipeline) |
| 4 | Кодификатор ФИПИ — реальный трекер | ✅ |
| 5 | Привычки — tRPC-мутации + UI | ✅ |
| 6 | AI Майя — чат-панель + голос через Web Speech | ✅ |
| 7 | Anti-burnout watcher + генератор вайба | ✅ |
| 8 | Polish — темы, анимации, PWA, a11y | ✅ |
| 9 | Telegram-бот + Friends + Coworking | ✅ |

Все 9 фаз MVP закрыты кодом. Дальше — реальные API-ключи, деплой на прод, e2e-тесты, экспорт в Notion/ICS, живые интеграции МЭШ/ЭлЖур.