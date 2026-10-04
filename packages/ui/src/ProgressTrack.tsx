"use client";
import * as React from "react";
import { cn } from "./cn";

type ProgressTrackProps = {
  value: number; // 0..1 или 0..100 (см. max)
  max?: number; // default 100
  variant?: "matcha" | "lavender" | "teal" | "rose" | "oat";
  height?: "thin" | "sm" | "md";
  label?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Мягкий прогресс-бар (как в мокапах: «68% / 89 тем усвоено»). */
export function ProgressTrack({
  value,
  max = 100,
  variant = "matcha",
  height = "sm",
  label,
  trailing,
  className,
  ariaLabel,
}: ProgressTrackProps) {
  const pct = Math.max(0, Math.min(1, value / max));

  const heights = { thin: "h-1.5", sm: "h-2", md: "h-3" } as const;
  const trackBg = {
    matcha: "bg-[var(--primary-track)]",
    lavender: "bg-[var(--secondary-100)]",
    teal: "bg-[#d8eaea]",
    rose: "bg-[#f9d8e3]",
    oat: "bg-[var(--surface-container)]",
  } as const;
  const fillGradients = {
    matcha: "linear-gradient(90deg, var(--primary-300), var(--primary-500))",
    lavender: "linear-gradient(90deg, var(--secondary-300), var(--secondary-500))",
    teal: "linear-gradient(90deg, #b3d6d6, #2e6f6f)",
    rose: "linear-gradient(90deg, #efb3cb, #a85070)",
    oat: "linear-gradient(90deg, var(--surface-container-high), var(--tertiary-600))",
  } as const;

  return (
    <div className={cn("w-full", className)}>
      {(label || trailing) && (
        <div className="flex items-center justify-between mb-1.5 text-[13px] leading-tight">
          {label ? <span className="text-[var(--on-surface-variant)]">{label}</span> : <span />}
          {trailing ? <span className="font-semibold text-[var(--on-surface)]">{trailing}</span> : null}
        </div>
      )}
      <div
        className={cn("relative w-full rounded-full overflow-hidden", heights[height], trackBg[variant])}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={Math.round(pct * max)}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct * 100}%`, background: fillGradients[variant] }}
        />
      </div>
    </div>
  );
}