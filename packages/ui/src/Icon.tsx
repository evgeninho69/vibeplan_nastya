"use client";
import * as React from "react";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number | string;
  title?: string;
};

/**
 * Material Symbols Outlined (загружается на странице через <link>).
 * По DESIGN.md используется иконки из MSO с переменной FILL.
 */
export function Icon({ name, className, filled = false, size, title }: IconProps) {
  const style: React.CSSProperties = {};
  if (size) {
    const s = typeof size === "number" ? `${size}px` : size;
    style.fontSize = s;
    style.width = s;
    style.height = s;
  }
  return (
    <span
      className={cn(
        "material-symbols-outlined align-[-0.125em] inline-block leading-none",
        className
      )}
      style={{
        ...style,
        fontVariationSettings: filled
          ? '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 24'
          : undefined,
      }}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      title={title}
    >
      {name}
    </span>
  );
}

import { cn } from "./cn";