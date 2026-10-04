"use client";

import { Card, Icon, PillButton } from "@vibeplan/ui";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[app] runtime error", error);
  }, [error]);

  return (
    <div className="min-h-dvh grid place-items-center px-5 py-10 bg-[var(--background)]">
      <Card variant="sticker" pad="lg" className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="size-12 rounded-2xl grid place-items-center"
            style={{ background: "var(--error-container)", color: "var(--on-error-container)" }}
          >
            <Icon name="error_outline" size={24} />
          </span>
          <div>
            <h2 className="font-bold text-[22px] tracking-tight">Что-то пошло не так</h2>
            <p className="text-[13px] text-[var(--on-surface-variant)]">
              Ничего страшного. Попробуй перезагрузить — если не поможет, мы уже получили лог.
            </p>
          </div>
        </div>
        {error.digest ? (
          <p className="mt-3 text-[12px] font-mono text-[var(--on-surface-variant)]">
            digest: {error.digest}
          </p>
        ) : null}
        <div className="mt-5 flex items-center gap-2">
          <PillButton variant="primary" size="md" onClick={reset}>
            <Icon name="refresh" size={18} /> Попробовать снова
          </PillButton>
          <PillButton variant="soft" size="md" onClick={() => (window.location.href = "/today")}>
            <Icon name="home" size={18} /> На главную
          </PillButton>
        </div>
      </Card>
    </div>
  );
}