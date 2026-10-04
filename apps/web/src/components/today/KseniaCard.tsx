"use client";

import * as React from "react";
import { Avatar, Card, Icon, PillButton } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

/**
 * Правая нижняя карточка «Ксюша Дубова — ИИ-совпадение в графике» из мокапа coffee_vanilla_matcha_1.
 */
export function KseniaCard() {
  return (
    <Card variant="paper" pad="md" className="bg-gradient-to-br from-[var(--secondary-100)]/40 to-transparent">
      <header className="flex items-center gap-3 mb-3">
        <span
          className="inline-grid place-items-center size-9 rounded-2xl text-[14px] font-bold"
          style={{ background: "var(--secondary-200)", color: "var(--secondary-500)" }}
        >
          КД
        </span>
        <h3 className="font-semibold text-[18px] flex-1">Ксюша Дубова</h3>
        <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--secondary-100)] text-[var(--secondary-500)] text-[12px] font-semibold">
          <Icon name="auto_awesome" size={14} />
          ИИ-совпадение
        </span>
      </header>

      <p className="text-[14px] leading-snug mb-4">
        У вас обеих окно в четверг <strong>18:00–19:15</strong>. Предложить пойти за матча-латте в «Слой»?
      </p>

      <PillButton variant="secondary" size="md" fullWidth>
        <Icon name="send" size={18} />
        Отправить инвайт Ксюше
      </PillButton>
    </Card>
  );
}

/**
 * Маленькая «Майя ИИ онлайн» плашка в левом нижнем углу (как на мокапе coffee_vanilla_matcha_1).
 * Подтягивает актуальный nudge через maya.regenerateVibe + кнопка обновления.
 */
export function MayaNudge() {
  const [nudge, setNudge] = React.useState<{ quote: string; suggestion?: string | null } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const regenerate = trpc.maya.regenerateVibe.useMutation({
    onSuccess: (data) => {
      setNudge({ quote: data.quote, suggestion: data.suggestion });
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  React.useEffect(() => {
    regenerate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card variant="paper" pad="md" className="bg-[var(--primary-track)]/60 border-[rgba(77,107,75,0.18)]">
      <header className="flex items-center gap-3 mb-3">
        <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--primary-500)] text-[var(--on-primary)]">
          <Icon name="support_agent" size={20} />
        </span>
        <h3 className="font-semibold text-[16px] flex-1">ИИ — подружка Майя</h3>
        <Avatar src={null} name="Майя" size="xs" status="online" />
      </header>
      <p className="text-[13px] leading-snug min-h-[3rem]">
        {nudge ? (
          <>
            <span className="italic">{nudge.quote}</span>
            {nudge.suggestion ? (
              <>
                {" "}
                <span className="text-[var(--on-surface-variant)]">— {nudge.suggestion}</span>
              </>
            ) : null}
          </>
        ) : (
          <em className="opacity-60">{loading ? "Майя думает…" : "Мягкого дня ☕"}</em>
        )}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-[var(--primary-500)] inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[var(--primary-500)]" />
          Бот активен
          <span className="mx-1 opacity-40">·</span>
          TG Sync
        </span>
        <button
          type="button"
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          aria-label="Другой nudge"
          className="ml-auto size-8 rounded-full grid place-items-center bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] vp-press disabled:opacity-50"
        >
          <Icon name="refresh" size={14} />
        </button>
      </div>
    </Card>
  );
}