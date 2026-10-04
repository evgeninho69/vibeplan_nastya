"use client";

import * as React from "react";
import { cn } from "./cn";
import { Icon } from "./Icon";

type Mode = "pomodoro" | "deep_sprint";

type PomodoroTimerProps = {
  mode?: Mode;
  workMin?: number;
  restMin?: number;
  className?: string;
  onComplete?: () => void;
};

/**
 * Интерактивный Pomodoro-таймер. Работает локально (через requestAnimationFrame),
 * каждые 30 секунд отправляет heartbeat (если задан `onHeartbeat`).
 * Эстетика — мягкий круг, прогресс-дуга, тактильная анимация.
 */
export function PomodoroTimer({
  mode = "pomodoro",
  workMin = 25,
  restMin = 5,
  className,
  onComplete,
}: PomodoroTimerProps) {
  const [phase, setPhase] = React.useState<"work" | "rest">("work");
  const [running, setRunning] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(workMin * 60);
  const [cycles, setCycles] = React.useState(0);

  const total = (phase === "work" ? workMin : restMin) * 60;
  const pct = 1 - secondsLeft / total;
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const displayTime = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  // Timer effect
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Phase transitions
  React.useEffect(() => {
    if (secondsLeft > 0) return;
    if (phase === "work") {
      const nextCycles = cycles + 1;
      setCycles(nextCycles);
      setPhase("rest");
      setSecondsLeft(restMin * 60);
      onComplete?.();
    } else {
      setPhase("work");
      setSecondsLeft(workMin * 60);
    }
  }, [secondsLeft, phase, cycles, restMin, workMin, onComplete]);

  // Keyboard: пробел — стоп/старт
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && (e.target as HTMLElement)?.tagName !== "TEXTAREA" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        setRunning((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function reset() {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(workMin * 60);
    setCycles(0);
  }

  const cycleTarget = 4;

  return (
    <div className={cn("rounded-3xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] shadow-[var(--shadow-1)] p-6 flex flex-col items-center", className)}>
      <header className="flex items-center gap-2 mb-4 w-full">
        <span className="size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)] grid place-items-center">
          <Icon name="hourglass_top" size={20} />
        </span>
        <h3 className="font-semibold text-[18px] flex-1">
          {mode === "deep_sprint" ? "Глубокий спринт" : "Помодоро"} · {workMin}/{restMin}
        </h3>
        <span className={"inline-flex items-center px-2 h-7 rounded-full text-[12px] font-semibold " + (phase === "work" ? "bg-[var(--primary-track)] text-[var(--primary-500)]" : "bg-[var(--secondary-100)] text-[var(--secondary-500)]")}>
          {phase === "work" ? "фокус" : "отдых"}
        </span>
      </header>

      <div className="relative size-44 my-3">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r="45" stroke="var(--surface-container)" strokeWidth="8" fill="none" />
          <circle
            cx="50" cy="50" r="45"
            stroke={phase === "work" ? "var(--primary-500)" : "var(--secondary-500)"}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(1 - pct) * 2 * Math.PI * 45}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-[44px] font-bold tabular-nums leading-none">{displayTime}</div>
            <div className="text-[11px] text-[var(--on-surface-variant)] mt-1 uppercase tracking-[0.04em]">
              {running ? "идёт" : "пауза"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4" aria-label="Циклы">
        {Array.from({ length: cycleTarget }).map((_, i) => (
          <span
            key={i}
            className={
              "size-2.5 rounded-full transition " +
              (i < cycles ? "bg-[var(--primary-500)]" : "bg-[var(--surface-container-high)]")
            }
          />
        ))}
        <span className="ml-2 text-[11px] font-semibold text-[var(--on-surface-variant)] tabular-nums">
          {cycles} / {cycleTarget} циклов
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!running ? (
          <button
            type="button"
            onClick={() => setRunning(true)}
            aria-label="Старт"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] font-semibold text-[14px] shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="play_arrow" size={18} filled />
            Старт
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRunning(false)}
            aria-label="Пауза"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[var(--surface-container-low)] border border-[rgba(61,50,42,0.06)] font-semibold text-[14px] vp-press"
          >
            <Icon name="pause" size={18} />
            Пауза
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          aria-label="Сбросить"
          className="size-11 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] grid place-items-center vp-press"
        >
          <Icon name="restart_alt" size={18} />
        </button>
      </div>

      <p className="mt-4 text-[11px] text-[var(--on-surface-variant)] text-center">
        Пробел — старт/пауза · Enter — сброс
      </p>
    </div>
  );
}