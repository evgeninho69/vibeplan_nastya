"use client";
import * as React from "react";
import { cn } from "./cn";

type ChipTone = "matcha" | "lavender" | "oat" | "rose" | "teal" | "neutral";

const tones: Record<ChipTone, string> = {
  matcha: "bg-[var(--primary-track)] text-[var(--primary-500)]",
  lavender: "bg-[var(--secondary-100)] text-[var(--secondary-500)]",
  oat: "bg-[var(--surface-container)] text-[var(--tertiary-600)]",
  rose: "bg-[#f9d8e3] text-[#a85070]",
  teal: "bg-[#d8eaea] text-[#2e6f6f]",
  neutral: "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
};

/**
 * Чипсы / теги из мокапов: 32px высота, pill-форма, тонированный фон.
 */
export function Chip({
  tone = "matcha",
  icon,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: ChipTone;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold tracking-[0.01em]",
        tones[tone],
        className
      )}
      {...rest}
    >
      {icon ? <span className="inline-flex items-center text-[14px]">{icon}</span> : null}
      {children}
    </span>
  );
}

/** Мягкая «булочка» с точкой-индикатором (для статусов и тэгов). */
export function DotChip({
  tone = "matcha",
  children,
  className,
}: {
  tone?: ChipTone;
  children: React.ReactNode;
  className?: string;
}) {
  const dotBg: Record<ChipTone, string> = {
    matcha: "bg-[var(--primary)]",
    lavender: "bg-[var(--secondary)]",
    oat: "bg-[var(--tertiary-600)]",
    rose: "bg-[#a85070]",
    teal: "bg-[#2e6f6f]",
    neutral: "bg-[var(--outline)]",
  };
  return (
    <Chip tone={tone} className={className}>
      <span className={cn("size-1.5 rounded-full", dotBg[tone])} aria-hidden />
      {children}
    </Chip>
  );
}