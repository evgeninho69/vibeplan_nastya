"use client";

import { useState } from "react";
import { Avatar, Card, Chip, Icon, MoodSlider, PillButton, ThemeCard } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";
import { MAYA_TONE_LABELS, ANCHOR_CATEGORY_LABELS } from "@vibeplan/shared";
import { MOCK_USER } from "@vibeplan/db/mock";

export function ProfileAiView() {
  const utils = trpc.useUtils();
  const { data: profile } = trpc.profile.me.useQuery();
  const { data: anchors = [] } = trpc.profile.anchors.useQuery();
  const { data: mayaStatus } = trpc.maya.status.useQuery();
  const regenerate = trpc.maya.regenerateVibe.useMutation();
  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => utils.profile.me.invalidate(),
  });

  const p = profile ?? MOCK_USER;
  const name = p.name ?? "Аня";
  const [energyDraft, setEnergyDraft] = useState<number>(p.energyToday);
  const [softnessDraft, setSoftnessDraft] = useState<number>(p.mayaSoftness);

  const tones = Object.keys(MAYA_TONE_LABELS) as (keyof typeof MAYA_TONE_LABELS)[];
  const currentTone = (p.mayaTone ?? "caring") as keyof typeof MAYA_TONE_LABELS;

  return (
    <div className="flex flex-col gap-5 vp-stagger">
      {/* Шапка профиля */}
      <Card variant="paper" pad="md" className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 md:gap-7 items-center">
        <div className="flex items-center gap-4">
          <Avatar src={null} alt={name} name={name} size="xl" status="online" />
          <div className="leading-tight">
            <div className="text-[14px] text-[var(--on-surface-variant)]">{p.grade} класс</div>
            <h2 className="font-bold text-[24px] md:text-[28px] tracking-[-0.015em]">{name} Ларионова</h2>
            <div className="mt-1 inline-flex items-center gap-2 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
              <Icon name="track_changes" size={14} />
              Цель: {p.goalText ?? "—"}
            </div>
          </div>
        </div>
        <p className="text-[13px] text-[var(--on-surface-variant)] leading-relaxed">
          Готовлюсь к ЕГЭ по профильной математике, русскому и инфе. Люблю греблю, пью матчу в «Слое», шью дроп <span className="font-semibold">Jazz</span> с 3D-люверсами из фотополимера.
        </p>
        <div className="grid grid-cols-2 gap-3 md:w-72">
          <EnergyCard value={p.energyToday} onChange={(v) => {
            setEnergyDraft(v);
            updateMutation.mutate({ energyToday: v });
          }} />
          <StreakCard days={14} />
        </div>
      </Card>

      {/* Тон Майи + якоря */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card variant="paper" pad="md">
          <header className="flex items-center gap-3 mb-4">
            <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)]">
              <Icon name="record_voice_over" size={20} />
            </span>
            <h3 className="font-semibold text-[18px] flex-1">Характер и тон общения Майи</h3>
            <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[12px] font-semibold">
              ИИ {mayaStatus?.model?.includes("claude") ? "v4.2" : "stub"} · {mayaStatus?.mode ?? "stub"}
            </span>
          </header>

          <ul className="flex flex-col gap-2">
            {tones.map((key) => {
              const t = MAYA_TONE_LABELS[key];
              const active = currentTone === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => updateMutation.mutate({ mayaTone: key as "caring" | "academic" | "zen" })}
                    className={
                      "w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition vp-press " +
                      (active
                        ? "bg-[var(--primary-track)] border-[rgba(77,107,75,0.3)]"
                        : "bg-[var(--surface-container-lowest)] border-[rgba(61,50,42,0.06)] hover:bg-[var(--surface-container-low)]")
                    }
                  >
                    <span
                      className={
                        "size-5 rounded-full grid place-items-center shrink-0 mt-0.5 " +
                        (active ? "bg-[var(--primary-500)] text-[var(--on-primary)]" : "border border-[rgba(61,50,42,0.18)]")
                      }
                    >
                      {active ? <Icon name="check" size={12} /> : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px]">{t.name}</span>
                        {key === "caring" ? (
                          <span className="inline-flex items-center px-2 h-5 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[10px] font-semibold">
                            Текущий
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[12px] text-[var(--on-surface-variant)] mt-1 leading-snug">{t.description}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5">
            <MoodSlider
              label="Мягкость дедлайнов"
              value={p.mayaSoftness}
              minLabel="Строгий спринт"
              maxLabel="Сверхбережный"
              onChange={(v) => {
                setSoftnessDraft(v);
                updateMutation.mutate({ mayaSoftness: Math.round(v) });
              }}
            />
            <p className="mt-2 text-[11px] text-[var(--on-surface-variant)] text-right tabular-nums">{Math.round(softnessDraft)}%</p>
          </div>
        </Card>

        <Card variant="paper" pad="md">
          <header className="flex items-center gap-3 mb-3">
            <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--secondary-100)] text-[var(--secondary-500)]">
              <Icon name="memory" size={20} />
            </span>
            <h3 className="font-semibold text-[18px] flex-1">Что Майя помнит обо мне</h3>
            <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)] text-[12px] font-semibold">
              Память {anchors.length}/12 фактов
            </span>
          </header>
          <p className="text-[13px] text-[var(--on-surface-variant)] mb-3">
            Эти контекстные якоря помогают Майе реагировать на реальную жизнь и беречь твоё расписание.
          </p>

          <div className="flex flex-col gap-3">
            {(["study", "sport", "rest", "creative"] as const).map((cat) => (
              <div key={cat}>
                <div className="text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-[0.04em] mb-2">
                  {cat === "study" && "Сдает на ЕГЭ 2025"}
                  {cat === "sport" && "Вне учебы & спорт"}
                  {cat === "rest" && "Со-умайт & места силы"}
                  {cat === "creative" && "Творчество & хобби"}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {anchors
                    .filter((a: { category: string }) => a.category === cat)
                    .map((a: { id: string; content: string }) => (
                      <Chip key={a.id} tone={
                        cat === "study" ? "lavender"
                          : cat === "sport" ? "teal"
                          : cat === "rest" ? "matcha"
                          : "oat"
                      }>
                        <Icon name={
                          cat === "study" ? "menu_book"
                          : cat === "sport" ? "directions_run"
                          : cat === "rest" ? "place"
                          : "palette"
                        } size={14} />
                        {a.content}
                      </Chip>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <PillButton variant="soft" size="sm" onClick={() => updateMutation.mutate({ mayaTone: currentTone })}>
              <Icon name="add" size={16} /> Добавить факт
            </PillButton>
            <PillButton variant="soft" size="sm">
              <Icon name="mic" size={16} /> Надиктовать о себе
            </PillButton>
          </div>
        </Card>
      </div>

      {/* Темы */}
      <Card variant="paper" pad="md">
        <header className="flex items-center gap-3 mb-4">
          <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--secondary-100)] text-[var(--secondary-500)]">
            <Icon name="palette" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Атмосфера и цвета приложения</h3>
          <span className="text-[12px] text-[var(--on-surface-variant)]">Палитра: 4 варианта гармонии</span>
        </header>
        <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
          Цветовые палитры вдохновлены кофе, японской бумагой и утренним светом. Выбранная тема подсвечивает приложение в целом.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {(["matcha", "lavender", "coffee", "rose"] as const).map((id) => (
            <ThemeCard
              key={id}
              themeId={id}
              selected={p.theme === id}
              onSelect={() => {
                updateMutation.mutate({ theme: id });
                if (typeof document !== "undefined") {
                  document.documentElement.setAttribute("data-theme", id);
                  document.cookie = `vp-theme=${id}; path=/; max-age=31536000; SameSite=Lax`;
                  try { window.localStorage.setItem("vp-theme", id); } catch {}
                }
              }}
            />
          ))}
        </div>
      </Card>

      {/* Вайб дня (regenerate) */}
      <Card variant="paper" pad="md">
        <header className="flex items-center gap-3 mb-3">
          <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)]">
            <Icon name="auto_awesome" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Вайб дня · Майя</h3>
          <PillButton variant="soft" size="sm" disabled={regenerate.isPending} onClick={() => regenerate.mutate()}>
            <Icon name="refresh" size={16} /> Другой вайб
          </PillButton>
        </header>
        {regenerate.data ? (
          <>
            <p className="text-[16px] italic font-semibold leading-snug">{regenerate.data.quote}</p>
            {regenerate.data.suggestion ? (
              <p className="mt-2 text-[13px] text-[var(--on-surface-variant)]">{regenerate.data.suggestion}</p>
            ) : null}
          </>
        ) : (
          <>
            <p className="text-[16px] italic font-semibold leading-snug">«Спокойный шаг тоже ведёт к цели. Ты всё успеваешь.»</p>
            <p className="mt-2 text-[13px] text-[var(--on-surface-variant)]">Настя: Сделай глубокий вдох перед уроком матчи.</p>
          </>
        )}
      </Card>
    </div>
  );
}

function EnergyCard({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] p-3">
      <div className="text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-[0.04em] mb-1">Энергия</div>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary-500)]"
        aria-label="Уровень энергии сегодня"
      />
      <div className="text-[18px] font-bold tabular-nums mt-1">{value.toFixed(1)}<span className="text-[var(--on-surface-variant)] font-medium text-[13px]">/10</span></div>
    </div>
  );
}

function StreakCard({ days }: { days: number }) {
  return (
    <div className="rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] p-3">
      <div className="text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-[0.04em] mb-1">Стрик заботы</div>
      <div className="text-[18px] font-bold tabular-nums mt-1 flex items-center gap-1">
        <Icon name="favorite" size={16} className="text-[var(--primary-500)]" />
        {days} дней
      </div>
      <p className="text-[11px] text-[var(--on-surface-variant)] mt-1">Без штрафов за паузы</p>
    </div>
  );
}