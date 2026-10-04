"use client";

import { useEffect, useState } from "react";
import { Card, Icon, PillButton } from "@vibeplan/ui";
import { APP_NAME, MENTOR_NAME } from "@vibeplan/shared";

export default function SignInPage() {
  const [csrf, setCsrf] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    // Получаем CSRF-токен NextAuth для magic-link provider.
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((j) => setCsrf(j?.csrfToken ?? ""))
      .catch(() => setCsrf(""));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !csrf) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const body = new URLSearchParams({
        email: email.trim(),
        csrfToken: csrf,
        callbackUrl: "/today",
      });
      const res = await fetch("/api/auth/signin/email", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (res.ok || res.status === 302) {
        setFeedback({ kind: "ok", text: "Проверь почту — ссылка для входа отправлена." });
      } else {
        const txt = await res.text();
        setFeedback({ kind: "err", text: `Не получилось отправить: ${res.status}${txt ? " · " + txt.slice(0, 80) : ""}` });
      }
    } catch (e) {
      setFeedback({ kind: "err", text: `Ошибка соединения: ${(e as Error).message}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center px-5 py-10 bg-[var(--background)]">
      <Card variant="sticker" pad="lg" className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="size-12 rounded-2xl grid place-items-center"
            style={{ background: "var(--primary-500)", color: "var(--on-primary)" }}
          >
            <Icon name="spa" size={24} />
          </span>
          <div>
            <div className="text-[20px] font-bold tracking-tight">{APP_NAME}</div>
            <div className="text-[12px] text-[var(--on-surface-variant)]">Вход для пары {MENTOR_NAME} и тебя</div>
          </div>
        </div>

        <h1 className="font-bold text-[28px] leading-tight mb-2">Добро пожаловать</h1>
        <p className="text-[14px] text-[var(--on-surface-variant)] mb-5">
          Введи email — пришлём волшебную ссылку для входа. Никаких паролей.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input type="hidden" name="csrfToken" value={csrf} />
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--on-surface-variant)]">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.ru"
              autoComplete="email"
              className="h-12 px-4 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.1)] text-[14px] outline-none focus:border-[var(--primary-400)] focus:ring-2 focus:ring-[rgba(77,107,75,0.2)] transition"
            />
          </label>
          <PillButton variant="primary" size="lg" type="submit" fullWidth disabled={submitting || !csrf}>
            <Icon name="mail" size={18} />
            {submitting ? "Отправляю…" : "Прислать ссылку"}
          </PillButton>
        </form>

        {feedback ? (
          <div
            role="status"
            className={
              "mt-4 rounded-2xl p-3 text-[13px] " +
              (feedback.kind === "ok"
                ? "bg-[var(--primary-track)] text-[var(--primary-500)]"
                : "bg-[var(--error-container)] text-[var(--on-error-container)]")
            }
          >
            {feedback.text}
          </div>
        ) : null}

        <p className="mt-5 text-[12px] text-[var(--on-surface-variant)]">
          В режиме разработки magic-link печатается в консоль Next.js. В проде — будет уходить через Resend, когда добавишь <code className="font-mono">RESEND_API_KEY</code> и <code className="font-mono">AUTH_SECRET</code>.
        </p>
      </Card>
    </div>
  );
}