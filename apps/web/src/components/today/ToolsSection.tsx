"use client";

import { useState } from "react";
import { Card, Icon, MayaVoiceModal, PillButton, PomodoroTimer } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

/** Полоса инструментов под основной сеткой /today: Pomodoro + кнопка голосовой заметки. */
export function ToolsSection() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const utils = trpc.useUtils();
  const addAnchor = trpc.profile.addAnchor.useMutation({
    onSuccess: () => utils.profile.anchors.invalidate(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
      <PomodoroTimer mode="pomodoro" workMin={25} restMin={5} onComplete={() => {
            // В Phase 7 — heartbeat в /api/focus/heartbeat.
          }} />

      <Card variant="paper" pad="md" className="flex flex-col justify-between">
        <header className="flex items-center gap-3 mb-4">
          <span
            className="size-9 rounded-2xl grid place-items-center"
            style={{ background: "var(--secondary-100)", color: "var(--secondary-500)" }}
          >
            <Icon name="record_voice_over" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Голосовая заметка Майе</h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[var(--secondary-100)] text-[var(--secondary-500)] text-[12px] font-semibold">
            Web Speech
          </span>
        </header>
        <p className="text-[13px] text-[var(--on-surface-variant)] mb-4 leading-snug">
          Расскажите о чём-нибудь голосом — Майя сама распределит факт по категории и сохранит в память. Аудио обрабатывается локально на устройстве.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <PillButton variant="secondary" size="md" onClick={() => setVoiceOpen(true)}>
            <Icon name="mic" size={18} />
            Надиктовать новый факт
          </PillButton>
          <PillButton variant="soft" size="md" onClick={() => setVoiceOpen(true)}>
            <Icon name="auto_fix_high" size={18} />
            Или «Развести» расписание голосом
          </PillButton>
        </div>
        <p className="mt-4 text-[11px] text-[var(--on-surface-variant)]">
          Всего якорей: см. «Профиль & ИИ» → «Что Майя помнит обо мне»
        </p>
      </Card>

      <MayaVoiceModal
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onSend={async (text, category) => {
          await addAnchor.mutateAsync({ category, content: text, source: "voice" });
        }}
      />
    </div>
  );
}