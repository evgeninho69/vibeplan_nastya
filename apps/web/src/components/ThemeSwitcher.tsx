"use client";

import { useEffect, useState } from "react";
import type { ThemeId } from "@vibeplan/ui";
import { THEMES } from "@vibeplan/ui";

const STORAGE_KEY = "vp-theme";
const COOKIE_KEY = "vp-theme";

function readInitial(): ThemeId {
  if (typeof document === "undefined") return "matcha";
  const cookieTheme = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1] as ThemeId | undefined;
  if (cookieTheme && cookieTheme in THEMES) return cookieTheme;
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (stored && stored in THEMES) return stored;
  return "matcha";
}

function apply(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Плавающая кнопка переключения темы — появляется в правом-нижнем углу. */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("matcha");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initial = readInitial();
    setTheme(initial);
    apply(initial);
  }, []);

  function pick(next: ThemeId) {
    setTheme(next);
    apply(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6">
      {open ? (
        <div className="rounded-3xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-2)] p-3 grid grid-cols-2 gap-2 mb-3 animate-[vp-rise_180ms_ease-out]">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const t = THEMES[id];
            const active = theme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pick(id)}
                className={
                  "w-32 rounded-2xl border p-2 text-left transition vp-press " +
                  (active
                    ? "border-[var(--primary-500)] ring-2 ring-[rgba(77,107,75,0.18)]"
                    : "border-[rgba(61,50,42,0.06)] hover:border-[rgba(61,50,42,0.18)]")
                }
                aria-label={`Тема ${t.label}`}
              >
                <div className="h-12 rounded-xl mb-2 flex items-center gap-1 px-2" style={{ background: t.bg }}>
                  {t.swatches.map((c) => (
                    <span key={c} className="size-3 rounded-full border border-white/40" style={{ background: c }} />
                  ))}
                </div>
                <div className="text-[12px] font-semibold truncate">{t.label}</div>
              </button>
            );
          })}
        </div>
      ) : null}
      <button
        type="button"
        aria-label="Сменить тему оформления"
        onClick={() => setOpen((v) => !v)}
        className="size-12 rounded-full grid place-items-center bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-2)] hover:bg-[var(--surface-container-low)] transition vp-press"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>palette</span>
      </button>
      <style jsx global>{`
        @keyframes vp-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}