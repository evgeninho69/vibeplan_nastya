"use client";

import Link from "next/link";
import { Card, Icon, PillButton } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

const kindStyles: Record<string, { icon: string; label: string }> = {
  school: { icon: "school", label: "Школа" },
  study: { icon: "edit_note", label: "Учёба" },
  pomodoro: { icon: "hourglass_top", label: "Помодоро" },
  deep_sprint: { icon: "bolt", label: "Спринт" },
  coffee: { icon: "local_cafe", label: "Кофе-брейк" },
  sport: { icon: "directions_run", label: "Спорт" },
  rest: { icon: "self_improvement", label: "Отдых" },
  creative: { icon: "palette", label: "Творчество" },
};

type SessionView = {
  id: string;
  startsAt: string;
  endsAt: string;
  title: string;
  notes: string | null;
  location: string | null;
  status: string;
  kind: string;
};

type SessionsResult = { date: string; sessions: SessionView[] };

export function PlanOfTheDay() {
  // Реальный tRPC-запрос. В Phase 2a читает mock-store; в Phase 2c — Drizzle/Postgres.
  const { data, isLoading, error } = trpc.today.getSchedule.useQuery(undefined, {
    staleTime: 60_000,
  });
  const sessions = (data as SessionsResult | undefined)?.sessions ?? [];

  return (
    <Card variant="paper" pad="md">
      <header className="flex items-center gap-3 mb-4">
        <span
          className="size-9 rounded-2xl grid place-items-center"
          style={{ background: "var(--surface-container)", color: "var(--tertiary-600)" }}
        >
          <Icon name="calendar_today" size={20} />
        </span>
        <h3 className="font-semibold text-[18px] flex-1">План на день</h3>
        <div className="hidden sm:inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface-container)]">
          {(["День", "Неделя", "Фокус"] as const).map((t, i) => (
            <button
              key={t}
              className={
                "px-3 h-8 rounded-full text-[12px] font-semibold transition vp-press " +
                (i === 0
                  ? "bg-[var(--surface-container-lowest)] text-[var(--on-surface)] shadow-[var(--shadow-1)]"
                  : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-2xl bg-[var(--surface-container-low)] p-6 text-center text-[13px] text-[var(--on-surface-variant)]">
          <Icon name="progress_activity" size={20} className="animate-spin inline-block mr-2" />
          Загружаю расписание через tRPC…
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-[var(--error-container)] p-4 text-[13px] text-[var(--on-error-container)]">
          Не получилось загрузить данные: {error.message}
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {sessions.map((s, idx) => {
            const style = kindStyles[s.kind] ?? kindStyles.study;
            const isDone = s.status === "done";
            return (
              <li key={s.id}>
                <div
                  className={
                    "rounded-3xl border p-4 md:p-5 transition " +
                    (isDone
                      ? "bg-[var(--primary-track)] border-[rgba(77,107,75,0.18)]"
                      : "bg-[var(--surface-container-lowest)] border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)]")
                  }
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="text-center w-14 shrink-0">
                      <div className="text-[15px] font-bold tabular-nums leading-none">{s.startsAt}</div>
                      <div className="text-[12px] text-[var(--on-surface-variant)] tabular-nums mt-1">{s.endsAt}</div>
                    </div>
                    <span
                      className="inline-grid place-items-center size-10 rounded-2xl shrink-0"
                      style={{ background: "var(--surface-container)", color: "var(--tertiary-600)" }}
                    >
                      <Icon name={style.icon} size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[16px] leading-snug mb-1">{s.title}</h4>
                      {s.notes ? (
                        <p className="text-[13px] text-[var(--on-surface-variant)] leading-snug">{s.notes}</p>
                      ) : null}
                      {s.location ? (
                        <p className="mt-1 text-[12px] text-[var(--on-surface-variant)] inline-flex items-center gap-1">
                          <Icon name="place" size={14} />
                          {s.location}
                        </p>
                      ) : null}
                    </div>
                    {!isDone ? (
                      <button
                        type="button"
                        aria-label="Запустить сессию"
                        className="size-10 rounded-2xl grid place-items-center bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] vp-press hover:bg-[var(--surface-container-low)]"
                      >
                        <Icon name="play_arrow" size={20} />
                      </button>
                    ) : (
                      <span className="size-10 rounded-2xl grid place-items-center bg-[var(--primary)] text-[var(--on-primary)]">
                        <Icon name="check" size={20} />
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-4 border-t border-[rgba(61,50,42,0.06)]">
        <div className="text-[13px] text-[var(--on-surface-variant)]">Устала или изменились планы?</div>
        <PillButton variant="soft" size="sm">
          Перенести задачу без чувства вины
          <Icon name="spa" size={16} />
        </PillButton>
      </div>
    </Card>
  );
}