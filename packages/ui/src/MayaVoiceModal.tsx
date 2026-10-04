"use client";

import * as React from "react";
import { cn } from "./cn";
import { Icon } from "./Icon";
import { SoftModal } from "./SoftModal";
import { Waveform } from "./Waveform";

type MayaVoiceModalProps = {
  open: boolean;
  onClose: () => void;
  /** Колбэк после успешной отправки транскрипта. */
  onSend?: (text: string, category: "study" | "rest" | "sport" | "creative") => Promise<void> | void;
};

/**
 * Модал голосовой заметки Майе. Повторяет дизайн мокапа
 * `live_waveform_speech_to_text/code.html`: «Слушаю твою мысль…», живой waveform,
 * распознавание речи через Web Speech API (ru-RU), отправка на сервер.
 */
export function MayaVoiceModal({ open, onClose, onSend }: MayaVoiceModalProps) {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [transcript, setTranscript] = React.useState("");
  const [interim, setInterim] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [category, setCategory] = React.useState<"study" | "rest" | "sport" | "creative">("study");
  const [supported, setSupported] = React.useState(false);
  const [recognitionRef] = React.useState<{ current: unknown }>({ current: null });
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const W = window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition };
    setSupported(Boolean(W.webkitSpeechRecognition || W.SpeechRecognition));
  }, []);

  // Stop everything on close
  React.useEffect(() => {
    if (!open) {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Seconds counter
  React.useEffect(() => {
    if (!recording || paused) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording, paused]);

  async function start() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(media);
      setRecording(true);
      setPaused(false);
      setSeconds(0);

      const W = window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition };
      const RecCtor = W.webkitSpeechRecognition || W.SpeechRecognition;
      if (RecCtor) {
        const rec = new RecCtor();
        rec.lang = "ru-RU";
        rec.interimResults = true;
        rec.continuous = true;
        rec.onresult = (e: SpeechRecognitionEvent) => {
          let final = "";
          let interimT = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (!r) continue;
            if (r.isFinal) final += r[0].transcript;
            else interimT += r[0].transcript;
          }
          if (final) setTranscript((t) => (t + " " + final).trim());
          setInterim(interimT);
        };
        rec.onend = () => {
          // Если запись ещё идёт — продолжаем. Web Speech иногда сам отваливается.
        };
        rec.onerror = () => {};
        rec.start();
        recognitionRef.current = rec;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[voice] getUserMedia error", e);
    }
  }

  function pause() {
    const rec = recognitionRef.current as { stop?: () => void; start?: () => void } | null;
    rec?.stop?.();
    setPaused(true);
  }

  function resume() {
    const rec = recognitionRef.current as { start?: () => void } | null;
    rec?.start?.();
    setPaused(false);
  }

  function stop() {
    const r = recognitionRef.current as { stop?: () => void } | null;
    r?.stop?.();
    recognitionRef.current = null;
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setRecording(false);
    setPaused(false);
    setInterim("");
  }

  async function send() {
    const text = transcript.trim();
    if (!text) return;
    setBusy(true);
    try {
      await onSend?.(text, category);
      // Очищаем локально
      setTranscript("");
      setInterim("");
      setSeconds(0);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <SoftModal open={open} onClose={onClose} size="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[11px] font-semibold tracking-[0.02em] bg-[var(--primary-track)] text-[var(--primary-500)]">
            Контекстный якорь · Память Майи
          </span>
          <span className={"inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[11px] font-semibold tracking-[0.02em] " + (recording && !paused ? "bg-[var(--error-container)] text-[var(--on-error-container)]" : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]")}>
            <span className="size-1.5 rounded-full bg-current" />
            {recording ? (paused ? "Пауза" : "Идёт запись") : "Ожидание"} · {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
          </span>
        </div>

        <div>
          <h2 className="font-bold text-[22px] leading-tight flex items-center gap-2">
            Слушаю твою мысль… <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 22 }}>sparkles</span>
          </h2>
          <p className="text-[13px] text-[var(--on-surface-variant)] mt-1">
            Майя в реальном времени превращает голосовую заметку в структурированный контекст для расписания и отдыха.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--surface-container-low)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[18px] text-[var(--primary-500)]" aria-hidden>graphic_eq</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--on-surface-variant)]">
              Живая расшифровка (Live transcription)
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-[var(--on-surface-variant)]">
              <span className="size-1.5 rounded-full bg-[var(--primary)]" />
              {supported ? "Распознавание речи…" : "Не поддерживается"}
            </span>
          </div>
          <div className="rounded-xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] p-3 min-h-[68px] text-[13px] leading-snug">
            <span className="whitespace-pre-wrap">{transcript || (interim ? <em className="text-[var(--on-surface-variant)]">{interim}</em> : <em className="text-[var(--on-surface-variant)]">Нажми «Старт», чтобы начать. Говори свободно, Майя выделит главное.</em>)}</span>
            {interim ? <span className="text-[var(--on-surface-variant)]"> {interim}</span> : null}
          </div>
          {interim ? (
            <p className="mt-2 text-[11px] text-[var(--on-surface-variant)] italic">
              <Icon name="mic" size={12} /> Слушаю тебя… Говори свободно, Майя выделит главное.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-[var(--surface-container-low)] p-4">
          <Waveform stream={stream} height={48} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {!recording ? (
                <button
                  type="button"
                  onClick={start}
                  aria-label="Начать запись"
                  className="size-12 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] grid place-items-center vp-press shadow-[var(--shadow-1)]"
                >
                  <Icon name="mic" size={22} />
                </button>
              ) : paused ? (
                <button
                  type="button"
                  onClick={resume}
                  aria-label="Продолжить"
                  className="size-12 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] grid place-items-center vp-press shadow-[var(--shadow-1)]"
                >
                  <Icon name="play_arrow" size={22} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pause}
                  aria-label="Пауза"
                  className="size-12 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] grid place-items-center vp-press"
                >
                  <Icon name="pause" size={22} />
                </button>
              )}
              <button
                type="button"
                onClick={() => { setTranscript(""); setInterim(""); setSeconds(0); }}
                aria-label="Перезаписать"
                className="h-10 px-4 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[13px] font-semibold vp-press"
              >
                <Icon name="restart_alt" size={14} /> Перезаписать
              </button>
            </div>
            <span className="text-[13px] text-[var(--on-surface-variant)] tabular-nums">
              {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")} / 01:00
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--primary-track)]/40 border border-[rgba(77,107,75,0.18)] p-3 flex items-start gap-2">
          <Icon name="lock" size={16} className="text-[var(--primary-600)] mt-0.5" />
          <p className="text-[12px] text-[var(--on-surface-variant)] leading-snug">
            Аудио обрабатывается локально на устройстве с заботой о приватности.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[12px] text-[var(--on-surface-variant)]">Категория:</span>
          <div className="flex gap-1.5 flex-wrap">
            {(["study", "rest", "sport", "creative"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={
                  "px-3 h-7 rounded-full text-[11px] font-semibold transition vp-press " +
                  (category === cat
                    ? cat === "study" ? "bg-[var(--secondary-100)] text-[var(--secondary-500)]"
                      : cat === "rest" ? "bg-[var(--primary-track)] text-[var(--primary-500)]"
                      : cat === "sport" ? "bg-[#d8eaea] text-[#2e6f6f]"
                      : "bg-[var(--surface-container)] text-[var(--tertiary-600)]"
                    : "bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[var(--on-surface-variant)]")
                }
              >
                {cat === "study" && "Учёба & Экзамены"}
                {cat === "rest" && "Отдых & Места силы"}
                {cat === "sport" && "Спорт & Здоровье"}
                {cat === "creative" && "Творчество & Хобби"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-full bg-[var(--surface-container)] text-[13px] font-semibold vp-press"
          >
            Отмена записи
          </button>
          <button
            type="button"
            onClick={send}
            disabled={!transcript.trim() || busy}
            className={
              "inline-flex items-center gap-2 h-11 px-5 rounded-full font-semibold text-[13px] vp-press transition " +
              (transcript.trim() && !busy
                ? "bg-[var(--primary-500)] text-[var(--on-primary)] shadow-[var(--shadow-1)]"
                : "bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed")
            }
          >
            <Icon name="check_circle" size={16} />
            Готово, применить факт
          </button>
        </div>
      </div>
    </SoftModal>
  );
}