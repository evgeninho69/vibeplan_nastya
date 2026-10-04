"use client";
import * as React from "react";
import { cn } from "./cn";

/**
 * Мягкий модал в стиле DESIGN.md (как «Добавить новый факт для Майи» в мокапе _2).
 * Не зависит от Radix/Headless — простой portal + scrim + esc.
 */
export function SoftModal({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
  size = "md",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(28,28,25,0.32)] backdrop-blur-[2px] animate-[vp-fade_160ms_ease-out]"
      />
      <div
        className={cn(
          "relative w-full rounded-3xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.08)] shadow-[var(--shadow-2)] p-6 md:p-7",
          "animate-[vp-rise_220ms_ease-out]",
          widths[size],
          className
        )}
      >
        {(title || subtitle) && (
          <div className="mb-4">
            {subtitle ? (
              <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full text-[11px] font-semibold tracking-[0.02em] mb-2"
                style={{ background: "var(--primary-track)", color: "var(--primary-500)" }}>
                {subtitle}
              </div>
            ) : null}
            {title ? <h2 className="text-[22px] leading-7 font-semibold">{title}</h2> : null}
          </div>
        )}
        <button
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute top-4 right-4 size-9 rounded-full grid place-items-center text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition vp-press"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
        {actions ? (
          <div className="mt-6 flex items-center justify-end gap-3">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}