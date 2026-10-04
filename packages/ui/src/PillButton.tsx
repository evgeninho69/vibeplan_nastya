"use client";
import * as React from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "outline" | "lavender";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)] shadow-[var(--shadow-1)]",
  secondary:
    "bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary-hover)] shadow-[var(--shadow-1)]",
  soft: "bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]",
  ghost: "bg-transparent text-[var(--tertiary-600)] hover:bg-[var(--surface-container-low)]",
  outline:
    "bg-[var(--surface-container-lowest)] text-[var(--on-surface)] border border-[rgba(61,50,42,0.1)] hover:bg-[var(--surface-container-low)]",
  lavender:
    "bg-[var(--secondary-100)] text-[var(--secondary-500)] hover:bg-[var(--secondary-200)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
};

export const PillButton = React.forwardRef<HTMLButtonElement, Props>(function PillButton(
  { variant = "primary", size = "md", iconLeft, iconRight, fullWidth, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-[transform,background-color,box-shadow] duration-200 vp-press",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {iconLeft ? <span className="-ml-1 inline-flex">{iconLeft}</span> : null}
      <span>{children}</span>
      {iconRight ? <span className="-mr-1 inline-flex">{iconRight}</span> : null}
    </button>
  );
});