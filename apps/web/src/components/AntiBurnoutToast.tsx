"use client";

import { useEffect, useState } from "react";
import { Icon } from "@vibeplan/ui";

/** Тост-уведомление от Майи, если anti-burnout watcher заметил низкую энергию.
 *  В Phase 7 в проде подключается к /api/nudges/last, здесь — эхо. */
export function AntiBurnoutToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Показываем через 30 секунд после загрузки (в проде: если есть активный nudge).
    const t = setTimeout(() => setVisible(true), 30_000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="rounded-3xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.08)] shadow-[var(--shadow-2)] p-4 flex items-start gap-3 vp-rise">
        <span className="size-10 rounded-2xl bg-[var(--secondary-100)] text-[var(--secondary-500)] grid place-items-center shrink-0">
          <Icon name="self_improvement" size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[14px] flex items-center gap-2">
            Мягкое предложение от Майи
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setVisible(false)}
              className="ml-auto size-6 rounded-full grid place-items-center hover:bg-[var(--surface-container)] vp-press"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
          <p className="text-[12px] text-[var(--on-surface-variant)] mt-1 leading-snug">
            Энергия ниже обычного третий день подряд. Давай сегодня сделаем только 2 сессии вместо 5, добавим дыхательную паузу 4-7-8 между ними. Без новых дедлайнов.
          </p>
        </div>
      </div>
    </div>
  );
}