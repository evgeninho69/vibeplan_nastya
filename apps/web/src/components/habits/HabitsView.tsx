"use client";

import { useMemo, useState } from "react";
import { Card, Icon, PillButton, ProgressTrack } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

type Habit = {
  id: string;
  code: string;
  title: string;
  unit: string;
  targetPerDay: number;
  targetMetadata: Record<string, unknown> | null;
  isCreative: boolean;
};

type HabitLogWithCode = {
  id: string;
  habitId: string;
  habitCode?: string;
  date: string;
  value: number;
  metadata: Record<string, unknown> | null;
  note: string | null;
};

const HABIT_ICONS: Record<string, string> = {
  water: "water_drop",
  matcha: "emoji_food_beverage",
  morning_matcha: "coffee",
  reading: "menu_book",
  breath_478: "air",
  rowing: "rowing",
  jazz_drop: "palette",
};

/** Кубики гидратации (как в мокапе _5). */
function HydrationRow({
  habit,
  value,
  onIncrement,
  onDecrement,
}: {
  habit: Habit;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const cells = Array.from({ length: habit.targetPerDay }).map((_, i) => i);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[16px]">Гидратация &amp; Матча</h4>
        <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
          <span className="tabular-nums">{value}</span> из <span className="tabular-nums">{habit.targetPerDay}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {cells.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => (i < value ? onDecrement() : onIncrement())}
            aria-label={`Стакан ${i + 1}`}
            className={
              "size-9 grid place-items-center rounded-2xl border transition vp-press " +
              (i < value
                ? "bg-[var(--primary-500)] border-[var(--primary-500)] text-[var(--on-primary)]"
                : "bg-[var(--surface-container-lowest)] border-dashed border-[rgba(61,50,42,0.18)] text-[var(--on-surface-variant)] hover:border-[var(--primary-300)]")
            }
          >
            {i < value ? <Icon name="check" size={16} /> : <Icon name={HABIT_ICONS[habit.code] ?? "local_cafe"} size={16} />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <PillButton variant="soft" size="sm" onClick={onIncrement}>
          <Icon name="add" size={16} /> +1 стакан воды
        </PillButton>
        <span className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
          <Icon name="eco" size={14} /> 1 матча выпита
        </span>
      </div>
    </div>
  );
}

export function HabitsView() {
  const utils = trpc.useUtils();
  const { data: habits = [], isLoading } = trpc.habits.list.useQuery();
  const { data: logs = [] } = trpc.habits.logs.useQuery(undefined, { staleTime: 0 });

  const logMutation = trpc.habits.log.useMutation({
    onSuccess: () => utils.habits.logs.invalidate(),
  });

  const valueByHabit = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of logs) {
      const code = (log as HabitLogWithCode).habitCode ?? "";
      map[code] = (map[code] ?? 0) + log.value;
    }
    return map;
  }, [logs]);

  if (isLoading) {
    return <div className="text-center text-[13px] text-[var(--on-surface-variant)] py-8">Загружаю привычки…</div>;
  }

  const water = habits.find((h) => h.code === "water");
  const matcha = habits.find((h) => h.code === "matcha");
  const reading = habits.find((h) => h.code === "reading");
  const breath = habits.find((h) => h.code === "breath_478");
  const morning = habits.find((h) => h.code === "morning_matcha");
  const rowing = habits.find((h) => h.code === "rowing");
  const jazz = habits.find((h) => h.code === "jazz_drop");

  const today = logs.length;
  const totalTarget = habits.filter((h) => !h.isCreative).reduce((s, h) => s + h.targetPerDay, 0);
  const totalDone = habits.filter((h) => !h.isCreative).reduce((s, h) => s + Math.min(h.targetPerDay, valueByHabit[h.code] ?? 0), 0);

  function increment(code: string, delta = 1) {
    logMutation.mutate({ habitCode: code, date: new Date().toISOString().slice(0, 10), value: delta });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
      {/* Streak + гидратация */}
      <Card variant="paper" pad="md" className="lg:col-span-5">
        <header className="flex items-center gap-3 mb-3">
          <span className="size-9 rounded-2xl grid place-items-center bg-[var(--primary-track)] text-[var(--primary-500)]">
            <Icon name="self_improvement" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">14 дней заботы о себе</h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
            {totalDone} / {totalTarget} сегодня
          </span>
        </header>
        <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
          Мягкий ритм без штрафов за паузы. Ты на верном пути, в своём комфортном темпе.
        </p>
        <div className="flex items-center gap-1.5 mb-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className={
                "size-3.5 rounded-full " +
                (i < 5 ? "bg-[var(--primary-500)]" : i === 5 ? "bg-[var(--primary-300)]" : "bg-[var(--surface-container-high)]")
              }
              aria-hidden
            />
          ))}
          <span className="ml-auto text-[12px] text-[var(--on-surface-variant)]">Осознанный баланс</span>
        </div>

        {water ? (
          <HydrationRow
            habit={water}
            value={valueByHabit["water"] ?? 0}
            onIncrement={() => increment("water", 1)}
            onDecrement={() => increment("water", -1)}
          />
        ) : null}
      </Card>

      {/* Чек-лист привычек дня */}
      <Card variant="paper" pad="md" className="lg:col-span-7">
        <header className="flex items-center gap-3 mb-4">
          <span className="size-9 rounded-2xl grid place-items-center bg-[var(--secondary-100)] text-[var(--secondary-500)]">
            <Icon name="format_list_bulleted" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Привычки дня · Bullet Journal</h3>
          <span className="text-[12px] text-[var(--on-surface-variant)]">
            {Object.values(valueByHabit).filter((v, i) => {
              const code = Object.keys(valueByHabit)[i];
              return v > 0 && habits.find((h) => h.code === code);
            }).length} из {habits.filter((h) => !h.isCreative).length} выполнено
          </span>
        </header>

        <ul className="flex flex-col gap-3">
          {reading ? (
            <HabitRow
              icon="menu_book"
              title="Салли Руни «Нормальные люди»"
              badge={`${valueByHabit["reading"] ?? 0} / 320 стр.`}
              done={valueByHabit["reading"] >= 20}
              onCheck={() => increment("reading", 5)}
              meta="Глава 9. Медленное вечернее чтение под тёплым светом торшера без смартфона."
              progress={{ value: valueByHabit["reading"] ?? 0, max: 320 }}
            />
          ) : null}

          {rowing ? (
            <HabitRow
              icon="rowing"
              title="Гребля в клубе (Четверг 19:30)"
              badge="на воде"
              badgeTone="teal"
              done={valueByHabit["rowing"] > 0}
              onCheck={() => increment("rowing", 1)}
              meta="Прогулка на воде: синхронизация дыхания, гребной клуб на набережной, свежий воздух."
            />
          ) : null}

          {breath ? (
            <HabitRow
              icon="air"
              title="Дыхательная пауза 4–7–8"
              badge="3 мин сон"
              done={valueByHabit["breath_478"] >= 2}
              onCheck={() => increment("breath_478", 1)}
              meta="Снижение вечернего кортизола: 4 сек вдох, 7 сек задержка, 8 сек мягкий выдох."
            />
          ) : null}

          {morning ? (
            <HabitRow
              icon="coffee"
              title="Утренний матча-ритуал без экрана"
              badge="осознанность"
              badgeTone="matcha"
              done={valueByHabit["morning_matcha"] > 0}
              onCheck={() => increment("morning_matcha", 1)}
              meta="Бамбуковый венчик тясэн, овсяное молоко, тишина и вид из окна на зелёную аллею."
            />
          ) : null}

          {jazz ? (
            <HabitRow
              icon="palette"
              title="Jazz — творческий проект"
              badge="творчество"
              badgeTone="rose"
              done={valueByHabit["jazz_drop"] > 0}
              onCheck={() => increment("jazz_drop", 1)}
              meta="3D-печать клипс из фотополимера, пошив оверсайз-худи."
              creative
            />
          ) : null}
        </ul>
      </Card>
    </div>
  );
}

function HabitRow({
  icon,
  title,
  badge,
  badgeTone = "neutral",
  done,
  onCheck,
  meta,
  progress,
  creative = false,
}: {
  icon: string;
  title: string;
  badge?: string;
  badgeTone?: "matcha" | "lavender" | "oat" | "teal" | "rose" | "neutral";
  done: boolean;
  onCheck: () => void;
  meta?: string;
  progress?: { value: number; max: number };
  creative?: boolean;
}) {
  const toneMap: Record<string, string> = {
    matcha: "bg-[var(--primary-track)] text-[var(--primary-500)]",
    lavender: "bg-[var(--secondary-100)] text-[var(--secondary-500)]",
    oat: "bg-[var(--surface-container)] text-[var(--tertiary-600)]",
    teal: "bg-[#d8eaea] text-[#2e6f6f]",
    rose: "bg-[#f9d8e3] text-[#a85070]",
    neutral: "bg-[var(--surface-container)] text-[var(--on-surface-variant)]",
  };
  return (
    <li className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--surface-container-low)]">
      <button
        type="button"
        onClick={onCheck}
        aria-pressed={done}
        aria-label={done ? "Выполнено" : "Отметить как выполненное"}
        className={
          "size-7 rounded-md shrink-0 grid place-items-center transition vp-press " +
          (done
            ? "bg-[var(--primary-500)] text-[var(--on-primary)]"
            : "border border-[rgba(61,50,42,0.18)] bg-[var(--surface-container-lowest)] hover:bg-[var(--surface-container)]")
        }
      >
        {done ? <Icon name="check" size={16} /> : null}
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] flex items-center gap-2 flex-wrap">
          <Icon name={icon} size={18} className="text-[var(--tertiary-600)]" />
          {title}
          {badge ? (
            <span className={"ml-auto inline-flex items-center px-2 h-6 rounded-full text-[11px] font-semibold " + toneMap[badgeTone]}>
              {badge}
            </span>
          ) : null}
        </div>
        {meta ? <p className="text-[13px] text-[var(--on-surface-variant)] mt-1">{meta}</p> : null}
        {progress ? (
          <ProgressTrack className="mt-2" value={progress.value} max={progress.max} variant="matcha" height="thin" />
        ) : null}
        {creative ? (
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-[0.04em]">
            <Icon name="auto_awesome" size={12} /> Без штрафов за паузы
          </span>
        ) : null}
      </div>
    </li>
  );
}