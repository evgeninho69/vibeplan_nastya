"use client";

import { useState } from "react";
import { Card, Icon, PillButton, ProgressTrack, SubjectTag } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

type Module = {
  id: string;
  name: string;
  sortOrder: number;
  topics: { id: string; code: string; name: string }[];
};

const SUBJECTS = [
  { code: "prof_math", label: "Проф. математика" },
  { code: "russian", label: "Русский язык" },
  { code: "informatics", label: "КЕГЭ Информатика" },
] as const;

export function EgeView() {
  const [subject, setSubject] = useState<typeof SUBJECTS[number]["code"]>("prof_math");
  const utils = trpc.useUtils();
  const { data: modules = [], isLoading } = trpc.ege.modules.useQuery({ subjectCode: subject });
  const { data: progress = [] } = trpc.ege.progress.useQuery({ subjectCode: subject });
  const markMutation = trpc.ege.markTopic.useMutation({
    onSuccess: () => utils.ege.progress.invalidate({ subjectCode: subject }),
  });

  const progressByTopic = new Map(progress.map((p) => [p.topicId, p]));

  // Мок прогресса для демо, пока БД не подключена.
  const localCompleted = new Set<string>([
    "topic-prof_math-algebra-1", "topic-prof_math-algebra-2", "topic-prof_math-algebra-3",
    "topic-prof_math-algebra-4", "topic-prof_math-algebra-5",
  ]);

  return (
    <div className="flex flex-col gap-5">
      {/* Цели */}
      <Card variant="paper" pad="md">
        <div className="flex items-start gap-4 flex-wrap">
          <span
            className="size-12 rounded-2xl grid place-items-center shrink-0"
            style={{ background: "var(--primary-track)", color: "var(--primary-500)" }}
          >
            <Icon name="track_changes" size={22} />
          </span>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-semibold text-[20px]">Цель: 85+ баллов ФИПИ 2025</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
                активная
              </span>
            </div>
            <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
              Спокойное освоение кодификатора ФИПИ, синхронизация с онлайн-школами и мягкий фокус без чувства вины.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {SUBJECTS.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setSubject(s.code)}
                  className={
                    "px-3.5 h-9 rounded-full text-[13px] font-semibold transition vp-press inline-flex items-center gap-2 " +
                    (subject === s.code
                      ? "bg-[var(--primary-500)] text-[var(--on-primary)] shadow-[var(--shadow-1)]"
                      : "bg-[var(--surface-container-low)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]")
                  }
                >
                  <Icon name={s.code === "prof_math" ? "calculate" : s.code === "russian" ? "translate" : "memory"} size={16} />
                  {s.label}
                </button>
              ))}
              <button className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border border-dashed border-[rgba(61,50,42,0.18)] text-[13px] font-semibold text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition vp-press">
                <Icon name="add" size={16} /> Добавить предмет
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Кодификатор */}
      <Card variant="paper" pad="md">
        <header className="flex items-center gap-3 mb-4">
          <span
            className="size-9 rounded-2xl grid place-items-center"
            style={{ background: "var(--primary-track)", color: "var(--primary-500)" }}
          >
            <Icon name="format_list_bulleted" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Трекер Кодификатора ФИПИ</h3>
          <span className="text-[12px] text-[var(--on-surface-variant)]">
            {SUBJECTS.find((s) => s.code === subject)?.label} 2025
          </span>
        </header>

        {isLoading ? (
          <div className="py-6 text-center text-[13px] text-[var(--on-surface-variant)]">Загружаю модули…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {(modules as Module[]).map((mod, idx) => {
              const doneTopics = mod.topics.filter((t) => localCompleted.has(t.id) || progressByTopic.get(t.id)?.status === "completed").length;
              const pct = mod.topics.length ? Math.round((doneTopics / mod.topics.length) * 100) : 0;
              return (
                <details key={mod.id} className="rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-1)] overflow-hidden" open={idx === 0}>
                  <summary className="flex items-center gap-3 cursor-pointer list-none px-4 py-3 select-none">
                    <span className="size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)] grid place-items-center text-[14px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] truncate">{mod.name}</div>
                      <div className="text-[12px] text-[var(--on-surface-variant)]">
                        Пройдено {doneTopics} из {mod.topics.length} тем ({pct}%)
                      </div>
                    </div>
                    <div className="hidden md:block w-40">
                      <ProgressTrack value={pct} max={100} variant="matcha" height="thin" />
                    </div>
                    <Icon name="expand_more" size={22} className="text-[var(--on-surface-variant)]" />
                  </summary>
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    {mod.topics.map((t) => {
                      const completed = localCompleted.has(t.id) || progressByTopic.get(t.id)?.status === "completed";
                      return (
                        <label
                          key={t.id}
                          className={
                            "flex items-center gap-3 px-3 h-11 rounded-2xl cursor-pointer transition vp-press " +
                            (completed
                              ? "bg-[var(--primary-track)]"
                              : "bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)]")
                          }
                        >
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => markMutation.mutate({ topicId: t.id, status: e.target.checked ? "completed" : "new", confidence: e.target.checked ? 80 : 0 })}
                            className="size-5 accent-[var(--primary-500)]"
                          />
                          <span className="font-semibold text-[14px] tabular-nums w-7">№{t.code}</span>
                          <span className="flex-1 text-[13px]">{t.name}</span>
                          {completed ? (
                            <span className="inline-flex items-center gap-1 px-2 h-6 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-[11px] font-semibold">
                              <Icon name="check" size={12} /> Готово
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[var(--on-surface-variant)] uppercase tracking-[0.04em]">Новая</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        )}

        <PillButton variant="primary" size="md" className="mt-5">
          <Icon name="sync_alt" size={18} />
          Обновить кодификатор ФИПИ 2025
        </PillButton>
      </Card>
    </div>
  );
}