"use client";

import { useEffect, useState } from "react";
import { Icon } from "@vibeplan/ui";

type Status = {
  dataMode: "mock" | "postgres";
  aiMode: "stub" | "openrouter";
  ocr: boolean;
  auth: boolean;
  hasDb: boolean;
  hasRedis: boolean;
};

/**
 * Плавающий баннер в правом-верхнем углу, показывает текущий режим.
 * Скрывается через 8 секунд после загрузки.
 */
export function DemoBanner() {
  const [status, setStatus] = useState<Status | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((j) => {
        setStatus({
          dataMode: j.dataMode,
          aiMode: j.aiConfigured ? "openrouter" : "stub",
          ocr: Boolean(j.aiConfigured),
          auth: Boolean(j.authConfigured),
          hasDb: Boolean(j.dbConfigured),
          hasRedis: Boolean(j.redisConfigured),
        });
      })
      .catch(() => undefined);
    const t = setTimeout(() => setHidden(true), 15_000);
    return () => clearTimeout(t);
  }, []);

  if (!status || hidden) return null;

  const allReal = status.dataMode === "postgres" && status.aiMode === "openrouter" && status.auth && status.hasRedis;
  if (allReal) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm vp-fade">
      <div className="rounded-2xl bg-[var(--surface-container-lowest)] border border-[rgba(77,107,75,0.18)] shadow-[var(--shadow-2)] p-3 flex items-start gap-3">
        <span className="size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)] grid place-items-center shrink-0">
          <Icon name="info" size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[13px] flex items-center gap-2">
            Демо-режим ВайбПлана
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setHidden(true)}
              className="ml-auto size-6 rounded-full grid place-items-center hover:bg-[var(--surface-container)] vp-press"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
          <ul className="mt-2 text-[11px] text-[var(--on-surface-variant)] leading-snug space-y-0.5">
            <li>
              <span className={status.dataMode === "postgres" ? "text-[var(--primary-500)]" : ""}>
                {status.dataMode === "postgres" ? "●" : "○"} БД: {status.dataMode === "postgres" ? "Postgres" : "in-memory mock"}
              </span>
            </li>
            <li>
              <span className={status.aiMode === "openrouter" ? "text-[var(--primary-500)]" : ""}>
                {status.aiMode === "openrouter" ? "●" : "○"} Майя: {status.aiMode === "openrouter" ? "claude-3.5-sonnet" : "canned-ответы"}
              </span>
            </li>
            <li>
              <span className={status.ocr ? "text-[var(--primary-500)]" : ""}>
                {status.ocr ? "●" : "○"} OCR: {status.ocr ? "gpt-4o-vision" : "текстовый stub"}
              </span>
            </li>
            <li>
              <span className={status.auth ? "text-[var(--primary-500)]" : ""}>
                {status.auth ? "●" : "○"} Авторизация: {status.auth ? "magic-link" : "без логина"}
              </span>
            </li>
          </ul>
          <p className="mt-2 text-[10px] text-[var(--on-surface-variant)] leading-snug">
            Чтобы включить реальные сервисы — добавьте ключи в <code className="font-mono">.env.local</code> и перезапустите. Полный список — в <a href="https://vibeplan.app/readme" className="underline underline-offset-2 hover:text-[var(--on-surface)]">README</a>.
          </p>
        </div>
      </div>
    </div>
  );
}