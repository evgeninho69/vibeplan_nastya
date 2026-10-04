"use client";

import { useState } from "react";
import { Card, Icon, PillButton } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";

type ScanResult = {
  ok: boolean;
  result?: {
    week: { day: string; lessons: { number: number; startsAt: string; endsAt: string; subjectRaw: string; room: string | null }[] }[];
    confidence: number;
    rawText?: string;
  };
  confidence: number;
  reason?: string;
};

const SAMPLE = `ЧТ
1. Литература 08:30-09:15 каб. 304
2. Алгебра 09:25-10:10 каб. 210
3. Обществознание 10:25-11:10 каб. 108
4. Английский 11:30-12:15 каб. 402
5. История 12:35-13:20 каб. 301
6. Информатика 13:30-14:15 каб. 215`;

export function SchoolScan() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const mutation = trpc.school.scan.useMutation({
    onSuccess: (data) => setResult(data as ScanResult),
  });

  const { data: status } = trpc.maya.status.useQuery();

  async function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      mutation.mutate({ imageDataUrl: dataUrl, hint: "week" });
    };
    reader.readAsDataURL(file);
  }

  return (
    <Card variant="paper" pad="md" className="lg:col-span-7">
      <header className="flex items-center gap-3 mb-3">
        <span className="size-9 rounded-2xl grid place-items-center bg-[var(--primary-track)] text-[var(--primary-500)]">
          <Icon name="image" size={20} />
        </span>
        <h3 className="font-semibold text-[18px] flex-1">Умное распознавание по фото / скриншоту</h3>
        <span className={"inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[12px] font-semibold " + (status?.mode === "openrouter" ? "bg-[var(--primary-track)] text-[var(--primary-500)]" : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]")}>
          {status?.mode === "openrouter" ? "gpt-4o-vision" : "OCR-заглушка"}
        </span>
      </header>
      <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
        Загрузи скриншот расписания из дневника или скриншот чата класса — сетка обновится мгновенно.
      </p>

      <div className="rounded-3xl border border-dashed border-[rgba(61,50,42,0.18)] bg-[var(--surface-container-low)] p-6 md:p-8 mb-4">
        <label className="grid place-items-center text-center cursor-pointer">
          <div className="size-12 rounded-2xl grid place-items-center bg-[var(--surface-container-highest)] text-[var(--tertiary-600)] mb-3">
            <Icon name="cloud_upload" size={22} />
          </div>
          <p className="font-semibold">{imagePreview ? "Сменить скриншот" : "Перетащи скриншот или нажми, чтобы выбрать файл"}</p>
          <p className="text-[12px] text-[var(--on-surface-variant)] mt-1">JPEG, PNG, HEIC до 8 МБ. Аудио обрабатывается локально на устройстве.</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
        {imagePreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagePreview} alt="" className="mt-4 rounded-2xl max-h-48 mx-auto" />
        ) : null}
      </div>

      <details className="rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] mb-4">
        <summary className="px-4 py-3 cursor-pointer text-[13px] font-semibold text-[var(--on-surface-variant)] select-none">
          Или вставь текстом (тестовый режим без API-ключа)
        </summary>
        <div className="p-4 pt-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={SAMPLE}
            rows={8}
            className="w-full rounded-2xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.1)] p-3 text-[13px] font-mono outline-none focus:border-[var(--primary-400)]"
          />
          <PillButton
            variant="soft"
            size="sm"
            className="mt-3"
            disabled={!text || mutation.isPending}
            onClick={() => mutation.mutate({ text, hint: "week" })}
          >
            <Icon name="auto_fix_high" size={16} /> Распознать текстом
          </PillButton>
        </div>
      </details>

      {mutation.isPending ? (
        <div className="rounded-2xl bg-[var(--surface-container-low)] p-4 text-[13px] text-[var(--on-surface-variant)] inline-flex items-center gap-2">
          <Icon name="progress_activity" size={16} className="animate-spin" /> Распознаю…
        </div>
      ) : result ? (
        <div className="rounded-2xl bg-[var(--primary-track)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="check_circle" size={18} className="text-[var(--primary-600)]" />
            <span className="font-semibold text-[14px]">Распознано</span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] text-[12px] font-semibold">
              Точность {Math.round((result.confidence ?? 0) * 100)}%
            </span>
          </div>
          {result.result ? (
            <div className="rounded-xl bg-[var(--surface-container-lowest)] p-3 mt-2">
              {result.result.week.map((d, i) => (
                <div key={i} className="mb-2 last:mb-0">
                  <div className="font-semibold text-[13px] mb-1">{d.day}</div>
                  <ul className="text-[12px] space-y-0.5">
                    {d.lessons.map((l, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className="w-5 shrink-0 font-semibold tabular-nums">{l.number}.</span>
                        <span className="tabular-nums">{l.startsAt}–{l.endsAt}</span>
                        <span className="font-semibold flex-1">{l.subjectRaw}</span>
                        <span className="text-[var(--on-surface-variant)]">каб. {l.room ?? "—"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--on-error-container)]">Ошибка: {result.reason}</p>
          )}
        </div>
      ) : null}
    </Card>
  );
}