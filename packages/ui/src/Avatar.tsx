"use client";
import * as React from "react";
import { cn } from "./cn";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "focus";
  className?: string;
};

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
} as const;

const statusColors = {
  online: "bg-[var(--primary)]",
  offline: "bg-[var(--outline-variant)]",
  focus: "bg-[var(--secondary)]",
} as const;

/** Круглый аватар с fallback-инициалами и опциональным статусом (как в Компонентах & друзьях). */
export function Avatar({ src, alt, name, size = "md", status, className }: AvatarProps) {
  const initials = (name ?? alt ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className={cn(
          "inline-grid place-items-center overflow-hidden rounded-full border border-[rgba(61,50,42,0.08)] bg-[var(--surface-container)] font-semibold text-[var(--on-surface-variant)]",
          sizes[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name ?? ""} className="size-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </span>
      {status ? (
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[var(--surface)]",
            statusColors[status]
          )}
        />
      ) : null}
    </span>
  );
}