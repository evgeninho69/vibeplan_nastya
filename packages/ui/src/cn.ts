import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Объединяет классы с поддержкой Tailwind-merge (последний выигрывает). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}