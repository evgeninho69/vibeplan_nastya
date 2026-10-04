"use client";
import * as React from "react";
import { cn } from "./cn";

/** Список предметов ЕГЭ из мокапов: «Проф. математика», «Русский язык», «КЕГЭ Информатика», и т.д. */
export const SUBJECT_TOKENS = {
  prof_math:   { label: "Проф. математика", short: "Матем.",     fg: "var(--primary-500)",  bg: "var(--primary-track)", abbr: "M" },
  math_base:    { label: "Базовая математика", short: "Мат. база", fg: "var(--primary-500)", bg: "var(--primary-track)", abbr: "M" },
  russian:      { label: "Русский язык",      short: "Русский",   fg: "var(--secondary-500)", bg: "var(--secondary-100)", abbr: "Р" },
  informatics:  { label: "Информатика (КЕГЭ)", short: "Информ.",  fg: "#2e6f6f",              bg: "#d8eaea",              abbr: "К" },
  physics:      { label: "Физика",            short: "Физика",    fg: "var(--primary-500)",  bg: "var(--primary-track)", abbr: "Ф" },
  literature:   { label: "Литература",        short: "Литер.",    fg: "var(--tertiary-600)", bg: "var(--surface-container)", abbr: "Л" },
  history:      { label: "История",           short: "История",   fg: "var(--tertiary-600)", bg: "var(--surface-container)", abbr: "И" },
  social:       { label: "Обществознание",    short: "Общ-во",    fg: "var(--tertiary-600)", bg: "var(--surface-container)", abbr: "О" },
  english:      { label: "Английский язык",   short: "Англ.",     fg: "var(--secondary-500)", bg: "var(--secondary-100)", abbr: "A" },
  biology:      { label: "Биология",          short: "Биология",  fg: "var(--primary-500)",  bg: "var(--primary-track)", abbr: "Б" },
  chemistry:    { label: "Химия",             short: "Химия",     fg: "var(--tertiary-600)", bg: "var(--surface-container)", abbr: "Х" },
} as const;

export type SubjectCode = keyof typeof SUBJECT_TOKENS;

/** Большой тег-предмет (как в мокапах с «Профильная математика 64% • 21/33 тем»). */
export function SubjectTag({
  code,
  className,
  children,
}: {
  code: SubjectCode;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = SUBJECT_TOKENS[code];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 h-9 rounded-full text-[13px] font-semibold",
        className
      )}
      style={{ background: t.bg, color: t.fg }}
    >
      <span
        className="inline-grid place-items-center size-5 rounded-full text-[10px] font-bold"
        style={{ background: t.fg, color: "var(--on-primary)" }}
        aria-hidden
      >
        {t.abbr}
      </span>
      <span>{children ?? t.label}</span>
    </span>
  );
}

/** Маленький inline-чип предмета (для тэгов «Русский 82% • 28/34 тем»). */
export function SubjectChip({
  code,
  className,
}: {
  code: SubjectCode;
  className?: string;
}) {
  const t = SUBJECT_TOKENS[code];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-semibold tracking-[0.02em]",
        className
      )}
      style={{ background: t.bg, color: t.fg }}
    >
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ background: t.fg }}
        aria-hidden
      />
      {t.label}
    </span>
  );
}