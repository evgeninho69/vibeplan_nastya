"use client";

import { Card, Icon, ProgressTrack, SubjectTag } from "@vibeplan/ui";
import type { SubjectCode } from "@vibeplan/shared";

type Item = { code: SubjectCode; value: number; topics: string };

const items: Item[] = [
  { code: "russian",     value: 82, topics: "28 / 34 тем" },
  { code: "prof_math",   value: 64, topics: "21 / 33 тем" },
  { code: "informatics", value: 71, topics: "19 / 27 тем" },
];

/**
 * Карточка «Кодификатор ЕГЭ» (как в мокапе coffee_vanilla_matcha_1).
 * Показывает общий прогресс по выбранным предметам и анонс умного импорта.
 */
export function CodifierCard() {
  return (
    <Card variant="paper" pad="md">
      <header className="flex items-start gap-3 mb-4">
        <span
          className="size-9 rounded-2xl grid place-items-center"
          style={{ background: "var(--primary-track)", color: "var(--primary-500)" }}
        >
          <Icon name="menu_book" size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[18px] leading-none">Кодификатор ЕГЭ</h3>
          <p className="text-[12px] text-[var(--on-surface-variant)] mt-1">Общий прогресс: 72%</p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {items.map((it) => (
          <div key={it.code}>
            <div className="flex items-baseline justify-between mb-2 gap-3">
              <SubjectTag code={it.code} className="!h-8 !text-[12px]" />
              <span className="text-[12px] text-[var(--on-surface-variant)] shrink-0 tabular-nums">{it.topics}</span>
            </div>
            <ProgressTrack
              value={it.value}
              max={100}
              variant="matcha"
              height="sm"
              trailing={<span className="text-[14px]">{it.value}%</span>}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-grid place-items-center size-6 rounded-full bg-[var(--surface-container-highest)] text-[var(--tertiary-600)]">
            <Icon name="image" size={14} />
          </span>
          <span className="font-semibold text-[14px]">Умный импорт онлайн</span>
          <span className="text-[12px] text-[var(--on-surface-variant)] ml-auto">— скрины школ, расписания</span>
        </div>
        <p className="text-[13px] text-[var(--on-surface-variant)] leading-snug">
          Синхронизировано из Умскул: 2 вебинара на этой неделе распределены без дедлайн-стресса и наложений.
        </p>
      </div>
    </Card>
  );
}