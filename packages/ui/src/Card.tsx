"use client";
import * as React from "react";
import { cn } from "./cn";

type CardVariant = "paper" | "sticker" | "washi" | "flat";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  /** Доп. отступ между секциями карточки. */
  pad?: "sm" | "md" | "lg";
};

/**
 * Карточка в духе DESIGN.md: бумажная тактица, rounded-3xl, мягкая тень Level 1.
 * variant="sticker" даёт более выпуклую тень Level 2.
 * variant="washi" — ассиметричные углы (имитация стикера).
 * variant="flat" — без тени (для вложенных модулей).
 */
export function Card({
  variant = "paper",
  pad = "md",
  className,
  children,
  ...rest
}: CardProps) {
  const padding =
    pad === "sm"
      ? "p-4"
      : pad === "lg"
      ? "p-7 md:p-8"
      : "p-5 md:p-6";

  const base = "relative bg-[var(--surface-container-lowest)] text-[var(--on-surface)]";

  const variants: Record<CardVariant, string> = {
    paper: "rounded-3xl border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)]",
    sticker: "rounded-3xl border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-2)]",
    washi:
      "rounded-3xl border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)]",
    flat: "rounded-3xl border border-[rgba(61,50,42,0.04)]",
  };

  return (
    <div className={cn(base, variants[variant], padding, className)} {...rest}>
      {children}
    </div>
  );
}

/** Секционный заголовок внутри карточки (используется в большинстве мокапов). */
export function CardHeader({
  icon,
  title,
  badge,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      {icon ? (
        <span className="size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary)] grid place-items-center">
          {icon}
        </span>
      ) : null}
      <h3 className="font-semibold text-[var(--text-title-lg-size)] leading-[var(--text-title-lg-lh)] flex-1">
        {title}
      </h3>
      {badge}
      {action}
    </div>
  );
}