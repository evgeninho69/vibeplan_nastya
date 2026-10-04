"use client";

import { Avatar, Icon } from "@vibeplan/ui";
import { MOCK_USER } from "@vibeplan/db/mock";

/**
 * Шапка страницы (повторяет «Четверг, 24 октября — Вайб дня: мягкий фокус — Начать фокус — АП»).
 * Перенесено с мокапа coffee_vanilla_matcha_1. На мобиле берёт вертикальный layout.
 */
export function PageHeader({
  date,
  title,
  vibe,
  pageTitle,
}: {
  date: string;
  title?: string;
  vibe?: string;
  /** Семантический h1 для скринридеров, если визуальный заголовок не нужен (например, /today). */
  pageTitle?: string;
}) {
  const d = new Date(date);
  const formatted = d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  const srOnlyTitle = pageTitle ?? title;

  return (
    <header className="px-5 md:px-8 pt-6 md:pt-8 pb-4">
      <div className="max-w-[var(--max-width)] mx-auto flex items-start justify-between gap-6 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-[13px] text-[var(--on-surface-variant)]">
            <span className="font-semibold">{formatted}</span>
            {vibe ? (
              <>
                {" · "}
                <span className="inline-flex items-center gap-1 px-2 h-6 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[11px] font-semibold align-middle">
                  <Icon name="spa" size={14} />
                  {vibe}
                </span>
              </>
            ) : null}
          </div>
          {title ? (
            <h1 className="font-bold text-[28px] md:text-[34px] leading-tight tracking-[-0.015em] text-[var(--on-surface)]">
              {title}
            </h1>
          ) : srOnlyTitle ? (
            <h1 className="sr-only">{srOnlyTitle}</h1>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[13px] font-semibold shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="mic" size={18} />
            Голосовая заметка Майе
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] text-[13px] font-semibold shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="play_arrow" size={18} filled />
            Начать фокус
          </button>
          <button
            type="button"
            aria-label="Уведомления"
            className="size-11 rounded-full grid place-items-center bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="notifications" size={20} />
          </button>
          <div className="flex items-center gap-3 pl-3 pr-4 h-11 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)]">
            <Avatar src={null} alt={MOCK_USER.name} name={MOCK_USER.name} size="sm" status="online" />
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[13px] font-semibold">{MOCK_USER.name} Ларионова</span>
              <span className="text-[11px] text-[var(--on-surface-variant)]">{MOCK_USER.classLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}