"use client";
import * as React from "react";
import { cn } from "./cn";

export type ThemeId = "matcha" | "lavender" | "coffee" | "rose";

const themes: Record<ThemeId, { label: string; description: string; swatches: string[]; bg: string; active: boolean }> = {
  matcha: {
    label: "Матча & Ваниль",
    description: "Текущая активная тема. Сливочный фон, оливковая матча и спокойствие.",
    swatches: ["#fcf9f4", "#ebe8e3", "#4d6b4b", "#aecfa9"],
    bg: "linear-gradient(135deg, #fcf9f4 0%, #ebe8e3 100%)",
    active: true,
  },
  lavender: {
    label: "Лавандовый лоу-фай",
    description: "Ночной уют, приглушённый черничный тон, мягкий лунный свет для поздних зссе.",
    swatches: ["#f3f0eb", "#eae5f5", "#685e86", "#a79dc4"],
    bg: "linear-gradient(135deg, #f3f0eb 0%, #eae5f5 100%)",
    active: false,
  },
  coffee: {
    label: "Тёплый кофейный крафт",
    description: "Карамельные акценты обжаренных зёрен, плотный картон и молочная пенка рафа.",
    swatches: ["#f4efe6", "#e5e2dd", "#5a483e", "#a07968"],
    bg: "linear-gradient(135deg, #f4efe6 0%, #e5e2dd 100%)",
    active: false,
  },
  rose: {
    label: "Розовый кварц & Пион",
    description: "Пудрово-розовые акценты, лепестки пионов, деликатный серый шёлк и нежность.",
    swatches: ["#fdf5f7", "#f9d8e3", "#a85070", "#cf8aa3"],
    bg: "linear-gradient(135deg, #fdf5f7 0%, #f9d8e3 100%)",
    active: false,
  },
};

/** Карточка выбора темы (как в мокапе coffee_vanilla_matcha_5). */
export function ThemeCard({
  themeId,
  selected = false,
  onSelect,
  className,
}: {
  themeId: ThemeId;
  selected?: boolean;
  onSelect?: (id: ThemeId) => void;
  className?: string;
}) {
  const t = themes[themeId];
  return (
    <button
      type="button"
      onClick={() => onSelect?.(themeId)}
      className={cn(
        "text-left rounded-3xl border p-4 md:p-5 transition vp-press",
        "bg-[var(--surface-container-lowest)]",
        selected
          ? "border-[var(--primary-500)] ring-2 ring-[rgba(77,107,75,0.18)] shadow-[var(--shadow-2)]"
          : "border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]",
        className
      )}
    >
      <div
        className="relative h-24 rounded-2xl mb-3 overflow-hidden border border-[rgba(61,50,42,0.06)]"
        style={{ background: t.bg }}
      >
        <div className="absolute top-3 left-3 inline-flex items-center gap-1">
          {t.swatches.map((c) => (
            <span
              key={c}
              className="size-4 rounded-full border border-white/40"
              style={{ background: c }}
            />
          ))}
        </div>
        {t.active ? (
          <span className="absolute bottom-2 left-3 inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11px] font-semibold bg-[var(--primary)] text-[var(--on-primary)]">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
            Активна сейчас
          </span>
        ) : null}
      </div>
      <div className="font-semibold text-[var(--text-title-md-size)] leading-[var(--text-title-md-lh)] mb-1">
        {t.label}
      </div>
      <p className="text-[13px] text-[var(--on-surface-variant)] leading-snug">{t.description}</p>
      <div className="mt-3 inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[12px] font-semibold bg-[var(--surface-container)] text-[var(--on-surface)]">
        Выбрать тему
      </div>
    </button>
  );
}

export const THEMES = themes;