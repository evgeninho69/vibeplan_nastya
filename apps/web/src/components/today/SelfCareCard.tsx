"use client";

import { Card, Icon, ProgressTrack } from "@vibeplan/ui";

/**
 * Карточка «Забота о себе» (правая колонка в мокапе coffee_vanilla_matcha_1).
 */
export function SelfCareCard() {
  return (
    <Card variant="paper" pad="md">
      <header className="flex items-center gap-3 mb-3">
        <span
          className="size-9 rounded-2xl grid place-items-center"
          style={{ background: "var(--secondary-100)", color: "var(--secondary-500)" }}
        >
          <Icon name="self_improvement" size={20} />
        </span>
        <h3 className="font-semibold text-[18px] flex-1">Забота о себе</h3>
        <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
          Сегодня <span className="ml-1 tabular-nums">3 / 3</span>
        </span>
      </header>

      <ul className="flex flex-col gap-2.5">
        <li className="flex items-center gap-3 px-3 h-12 rounded-2xl bg-[var(--surface-container-low)]">
          <span className="size-7 rounded-full bg-[var(--primary-500)] grid place-items-center text-[var(--on-primary)]">
            <Icon name="water_drop" size={16} />
          </span>
          <span className="font-semibold text-[14px] flex-1">Вода (1.8 л)</span>
          <span className="text-[12px] text-[var(--on-surface-variant)] tabular-nums">4 из 5</span>
        </li>
        <li className="flex items-center gap-3 px-3 h-12 rounded-2xl bg-[var(--surface-container-low)]">
          <span className="size-7 rounded-full bg-[var(--primary-500)] grid place-items-center text-[var(--on-primary)]">
            <Icon name="directions_walk" size={16} />
          </span>
          <span className="font-semibold text-[14px] flex-1">Прогулка 30 мин</span>
          <span className="size-6 rounded-md grid place-items-center bg-[var(--primary)] text-[var(--on-primary)]">
            <Icon name="check" size={16} />
          </span>
        </li>
        <li className="flex items-center gap-3 px-3 h-12 rounded-2xl bg-[var(--surface-container-low)]">
          <span className="size-7 rounded-full bg-[var(--primary-500)] grid place-items-center text-[var(--on-primary)]">
            <Icon name="self_improvement" size={16} />
          </span>
          <span className="font-semibold text-[14px] flex-1">Утренняя медитация</span>
          <span className="size-6 rounded-md grid place-items-center bg-[var(--primary)] text-[var(--on-primary)]">
            <Icon name="check" size={16} />
          </span>
        </li>
      </ul>

      <div className="mt-5 rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-[14px]">Книжный дневник</span>
          <span className="text-[12px] text-[var(--on-surface-variant)] tabular-nums">340 / 700 стр.</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="size-10 rounded-2xl grid place-items-center shrink-0"
            style={{ background: "var(--tertiary-100)", color: "var(--tertiary-600)" }}
          >
            <Icon name="menu_book" size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[13px] leading-tight">«Маленькая жизнь»</div>
            <div className="text-[12px] text-[var(--on-surface-variant)]">Ханья Янагихара</div>
          </div>
        </div>
        <ProgressTrack className="mt-3" value={340} max={700} variant="oat" height="thin" />
        <button
          type="button"
          className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[13px] font-semibold shadow-[var(--shadow-1)] vp-press"
        >
          <Icon name="mic" size={18} />
          Надиктовать рецензию ИИ
        </button>
      </div>
    </Card>
  );
}