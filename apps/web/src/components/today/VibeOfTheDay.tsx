"use client";

import * as React from "react";
import { Card, Icon } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";
import { MOCK_VIBE } from "@vibeplan/db/mock";

/**
 * Карточка «Вайб дня» (как в мокапе coffee_vanilla_matcha_1).
 * Подтягивает актуальный вайб через maya.regenerateVibe на монтировании и
 * по кнопке «Другой вайб». Пока грузится — показывает fallback из mock-store.
 */
export function VibeOfTheDay() {
  const [vibe, setVibe] = React.useState<{ quote: string; suggestion: string | null; energyPred: number } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const regenerate = trpc.maya.regenerateVibe.useMutation({
    onSuccess: (data) => {
      setVibe({ quote: data.quote, suggestion: data.suggestion, energyPred: data.energyPred });
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  function refresh() {
    setLoading(true);
    regenerate.mutate();
  }

  const display = vibe ?? {
    quote: MOCK_VIBE.quote,
    suggestion: MOCK_VIBE.suggestion,
  };

  return (
    <Card variant="paper" pad="md" className="bg-[var(--surface-container-lowest)]">
      <div className="flex items-start gap-4">
        <span
          className="size-11 rounded-2xl grid place-items-center shrink-0"
          style={{ background: "var(--primary-track)", color: "var(--primary-500)" }}
        >
          <Icon name="spa" size={22} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[13px] font-semibold text-[var(--primary-500)] uppercase tracking-[0.04em]">Вайб дня</span>
            <span className="text-[12px] text-[var(--on-surface-variant)]">
              · {new Date(MOCK_VIBE.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
            </span>
            {vibe?.energyPred != null ? (
              <span className="inline-flex items-center gap-1 px-2 h-8 rounded-full bg-[var(--surface-container)] text-[11px] font-semibold text-[var(--on-surface-variant)] tabular-nums">
                прогноз энергии {vibe.energyPred}/10
              </span>
            ) : null}
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label="Другой вайб"
              className="ml-auto inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[var(--surface-container)] text-[13px] font-semibold hover:bg-[var(--surface-container-high)] transition vp-press disabled:opacity-50"
            >
              <Icon name="refresh" size={16} className={loading ? "animate-spin" : ""} />
              Другой вайб
            </button>
          </div>
          <p className="font-semibold text-[20px] leading-snug italic text-[var(--on-surface)] mb-2 vp-fade">
            {display.quote}
          </p>
          {display.suggestion ? (
            <p className="text-[14px] text-[var(--on-surface-variant)] vp-fade">
              <span className="inline-flex items-center gap-1.5 mr-1">
                <span className="size-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
              </span>
              {display.suggestion}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}