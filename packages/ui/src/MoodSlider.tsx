"use client";
import * as React from "react";
import { cn } from "./cn";

type MoodSliderProps = {
  label: React.ReactNode;
  value: number; // 0..10
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

/**
 * Слайдер «Энергия 8.5/10» из мокапов Профиль & ИИ.
 * Мягкий, тактильный, с большим хваталом.
 */
export function MoodSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
  minLabel,
  maxLabel,
  className,
  ariaLabel,
}: MoodSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold">{label}</span>
        <span className="inline-flex items-center gap-2 px-3 h-8 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[13px] font-semibold tabular-nums">
          {value.toFixed(1)}
          <span className="text-[var(--on-surface-variant)] font-medium">/ {max}</span>
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-[var(--primary-track)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--primary-300), var(--primary-500))",
          }}
        />
        <input
          type="range"
          aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <span
          aria-hidden
          className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary-500)] border-4 border-[var(--surface)] shadow-[var(--shadow-2)] top-1/2 transition-[left] duration-150"
          style={{ left: `${pct}%` }}
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--on-surface-variant)]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}