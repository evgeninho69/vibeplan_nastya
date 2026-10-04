"use client";
import * as React from "react";
import { cn } from "./cn";

export type AnchorCategory = "study" | "rest" | "sport" | "creative";

const tones: Record<AnchorCategory, { bg: string; fg: string; icon: string; label: string }> = {
  study:   { bg: "var(--secondary-100)",   fg: "var(--secondary-500)",   icon: "menu_book",       label: "Учёба & Экзамены" },
  rest:    { bg: "var(--primary-track)",   fg: "var(--primary-500)",     icon: "self_improvement", label: "Отдых & Места силы" },
  sport:   { bg: "#d8eaea",                fg: "#2e6f6f",                icon: "directions_run",   label: "Спорт & Здоровье" },
  creative:{ bg: "var(--surface-container)", fg: "var(--tertiary-600)",  icon: "palette",          label: "Творчество & Хобби" },
};

/** «Контекстный якорь» памяти Майи — пилюля-чип с иконкой категории. */
export function AnchorChip({
  category,
  label,
  className,
  icon,
}: {
  category: AnchorCategory;
  label?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const t = tones[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold",
        className
      )}
      style={{ background: t.bg, color: t.fg }}
    >
      <span className="inline-flex items-center text-[16px]" aria-hidden>
        {icon ?? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>}
      </span>
      <span>{label ?? t.label}</span>
    </span>
  );
}

/** Компактный инлайн-чип с точкой (для списков в мокапе Профиль & ИИ). */
export function AnchorDot({
  category,
  label,
  className,
}: {
  category: AnchorCategory;
  label: React.ReactNode;
  className?: string;
}) {
  const t = tones[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] font-semibold tracking-[0.01em]",
        className
      )}
      style={{ background: t.bg, color: t.fg }}
    >
      <span className="inline-block size-1.5 rounded-full" style={{ background: t.fg }} aria-hidden />
      {label}
    </span>
  );
}