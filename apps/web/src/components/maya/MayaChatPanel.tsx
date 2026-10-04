"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Icon, PillButton } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

type ChatMessage = {
  id: string;
  role: "user" | "maya" | "system";
  content: string;
  createdAt: Date | string;
};

type LocalStreamState = {
  streaming: boolean;
  /** Текущий текст ответа Майи, который стримится в чат. */
  buffer: string;
};

const PROMPTS = [
  "Как лучше разбить задачу №16 на микро-шаги?",
  "Что делать, если застряла на третий час?",
  "Расскажи, как пережить паузу без чувства вины",
  "Посоветуй короткий спринт на сегодня",
];

export function MayaChatPanel() {
  const utils = trpc.useUtils();
  const { data: history = [], isLoading } = trpc.chat.history.useQuery({ limit: 50 });
  const { data: status } = trpc.maya.status.useQuery();

  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [sttSupported, setSttSupported] = useState(false);
  const [stream, setStream] = useState<LocalStreamState>({ streaming: false, buffer: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<unknown>(null);

  useEffect(() => {
    const W = window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition; SpeechRecognition?: typeof SpeechRecognition };
    setSttSupported(Boolean(W.webkitSpeechRecognition || W.SpeechRecognition));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history.length, stream.streaming, stream.buffer]);

  function startListening() {
    const W = window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition };
    const RecCtor = W.webkitSpeechRecognition || W.SpeechRecognition;
    if (!RecCtor) return;
    const rec = new RecCtor();
    rec.lang = "ru-RU";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let txt = "";
      let interimTxt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) txt += r[0].transcript;
        else interimTxt += r[0].transcript;
      }
      if (txt) setDraft((d) => (d + " " + txt).trim());
      setInterim(interimTxt);
    };
    rec.onend = () => { setIsListening(false); setInterim(""); };
    rec.onerror = () => { setIsListening(false); setInterim(""); };
    recRef.current = rec;
    setIsListening(true);
    rec.start();
  }

  function stopListening() {
    (recRef.current as { stop?: () => void } | null)?.stop?.();
    setIsListening(false);
  }

  /** SSE-стриминг ответа Майи через /api/chat/stream. */
  async function send() {
    const text = draft.trim();
    if (!text || stream.streaming) return;
    setDraft("");
    // Оптимистично добавляем user-сообщение в историю (refetch ниже после done).
    await utils.chat.history.invalidate();
    setStream({ streaming: true, buffer: "" });
    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok || !res.body) {
        setStream({ streaming: false, buffer: "Извини, Майя сейчас не отвечает." });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload) as { type: string; text?: string; fullText?: string };
            if (evt.type === "delta" && typeof evt.text === "string") {
              buf += evt.text;
              setStream({ streaming: true, buffer: buf });
            } else if (evt.type === "done" && typeof evt.fullText === "string") {
              buf = evt.fullText;
              setStream({ streaming: false, buffer: "" });
              // Рефетч истории, чтобы получить сохранённое сообщение Майи.
              await utils.chat.history.invalidate();
            } else if (evt.type === "error") {
              buf += "\n[ошибка]";
              setStream({ streaming: false, buffer: buf });
            }
          } catch {
            // ignore malformed line
          }
        }
      }
      if (stream.streaming) setStream({ streaming: false, buffer: "" });
    } catch (e) {
      setStream({ streaming: false, buffer: `Ошибка соединения: ${(e as Error).message}` });
    }
  }

  return (
    <Card variant="sticker" pad="md" className="flex flex-col h-[600px] sticky top-6">
      <header className="flex items-center gap-3 pb-3 border-b border-[rgba(61,50,42,0.06)]">
        <span className="size-10 rounded-2xl bg-[var(--primary-500)] text-[var(--on-primary)] grid place-items-center">
          <Icon name="support_agent" size={22} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[15px] flex items-center gap-2">
            Майя
            <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[10px] font-semibold">
              {status?.mode === "openrouter" ? "online · claude" : "online · stub"}
            </span>
          </div>
          <div className="text-[12px] text-[var(--on-surface-variant)]">
            {status?.mode === "openrouter"
              ? "Подключена к claude-3.5-sonnet через OpenRouter"
              : "Демо-режим: canned-ответы. Добавь OPENROUTER_API_KEY — заговорит по-настоящему"}
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center text-[13px] text-[var(--on-surface-variant)] mt-6">Загружаю чат…</div>
        ) : history.length === 0 ? (
          <>
            <Bubble role="maya">
              Привет! Я Майя. Расскажи, что сейчас на уме — про учёбу, ЕГЭ или просто про настроение. Без спешки 🍵
            </Bubble>
            <div className="flex flex-col gap-2 mt-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDraft(p)}
                  className="text-left rounded-2xl bg-[var(--surface-container-low)] px-3 py-2 text-[13px] hover:bg-[var(--surface-container)] transition vp-press"
                >
                  <Icon name="arrow_forward" size={12} className="inline-block mr-1 text-[var(--primary-500)]" />
                  {p}
                </button>
              ))}
            </div>
          </>
        ) : (
          (history as ChatMessage[]).map((m) => (
            <Bubble key={m.id} role={m.role}>{m.content}</Bubble>
          ))
        )}
        {stream.streaming ? (
          <Bubble role="maya">
            {stream.buffer || <em className="opacity-60">печатает…</em>}
            <span className="inline-block ml-0.5 animate-pulse">▍</span>
          </Bubble>
        ) : null}
      </div>

      <div className="pt-3 border-t border-[rgba(61,50,42,0.06)] flex flex-col gap-2">
        {interim ? (
          <div className="text-[12px] text-[var(--on-surface-variant)] italic px-3">{interim}</div>
        ) : null}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={isListening ? "Слушаю…" : "Напиши Майе или надиктуй голосом"}
            className="flex-1 rounded-2xl bg-[var(--surface-container-low)] border border-[rgba(61,50,42,0.06)] px-3 py-2 text-[14px] outline-none focus:border-[var(--primary-400)] resize-none max-h-32"
          />
          {sttSupported ? (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              aria-label="Голосовой ввод"
              className={
                "size-10 grid place-items-center rounded-2xl vp-press transition " +
                (isListening
                  ? "bg-[var(--error)] text-[var(--on-error)] animate-pulse"
                  : "bg-[var(--primary-track)] text-[var(--primary-500)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)]")
              }
            >
              <Icon name="mic" size={18} />
            </button>
          ) : null}
          <PillButton variant="primary" size="sm" onClick={send} disabled={!draft.trim() || stream.streaming}>
            <Icon name="send" size={16} />
          </PillButton>
        </div>
        <p className="text-[11px] text-[var(--on-surface-variant)] text-center">
          Аудио обрабатывается локально на устройстве с заботой о приватности
        </p>
      </div>
    </Card>
  );
}

function Bubble({ role, children }: { role: "user" | "maya" | "system"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-[var(--primary-500)] text-[var(--on-primary)] px-3 py-2 text-[14px] leading-snug">
        {children}
      </div>
    );
  }
  if (role === "system") {
    return (
      <div className="self-center max-w-[85%] text-[12px] text-[var(--on-surface-variant)] italic px-2">
        {children}
      </div>
    );
  }
  return (
    <div className="self-start max-w-[85%] flex items-start gap-2">
      <span className="size-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] grid place-items-center shrink-0 mt-0.5">
        <Icon name="support_agent" size={14} />
      </span>
      <div className="rounded-2xl rounded-bl-md bg-[var(--surface-container-low)] px-3 py-2 text-[14px] leading-snug">
        {children}
      </div>
    </div>
  );
}