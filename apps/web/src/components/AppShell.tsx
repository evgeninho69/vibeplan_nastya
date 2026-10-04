"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, PillButton } from "@vibeplan/ui";
import { cn } from "@vibeplan/ui";
import { MayaChatPanel } from "./maya/MayaChatPanel";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { href: "/today", label: "Сегодня", icon: "calendar_today" },
  { href: "/school", label: "Школа", icon: "school" },
  { href: "/ege", label: "ЕГЭ & Учёба", icon: "menu_book", badge: "68%" },
  { href: "/habits", label: "Привычки & Жизнь", icon: "self_improvement" },
  { href: "/friends", label: "Компоненты & Друзья", icon: "group" },
  { href: "/profile-ai", label: "Профиль & ИИ", icon: "person" },
];

const bottomNavItems: NavItem[] = [
  { href: "/today", label: "Сегодня", icon: "calendar_today" },
  { href: "/school", label: "Школа", icon: "school" },
  { href: "/ege", label: "ЕГЭ", icon: "menu_book" },
  { href: "/habits", label: "Привычки", icon: "self_improvement" },
  { href: "/profile-ai", label: "Майя", icon: "support_agent" },
];

/**
 * Боковая навигация (десктоп) + нижняя навигация (мобайл).
 * Повторяет дизайн сайдбара из coffee_vanilla_matcha_1.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-dvh w-full grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col gap-3 p-5 sticky top-0 h-dvh border-r border-[rgba(61,50,42,0.06)] bg-[var(--surface)]">
        <Brand />
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-12 px-4 rounded-full font-semibold text-[14px] transition vp-press",
                  active
                    ? "bg-[var(--primary-500)] text-[var(--on-primary)] shadow-[var(--shadow-1)]"
                    : "text-[var(--on-surface)] hover:bg-[var(--surface-container-low)]"
                )}
              >
                <Icon name={item.icon} size={20} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full text-[12px] font-semibold tabular-nums",
                      active
                        ? "bg-[var(--primary-700)] text-[var(--primary-100)]"
                        : "bg-[var(--primary-track)] text-[var(--primary-500)]"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Maya nudge (как «ИИ Майя онлайн» в мокапе) */}
        <div className="mt-auto rounded-3xl bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] p-4 shadow-[var(--shadow-1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-9 rounded-full bg-[var(--primary-track)] grid place-items-center">
              <Icon name="support_agent" size={20} className="text-[var(--primary-500)]" />
            </span>
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-semibold">ИИ Майя <span className="ml-1 inline-flex items-center px-2 h-5 rounded-full text-[10px] font-semibold bg-[var(--primary-track)] text-[var(--primary-500)]">онлайн</span></div>
              <div className="text-[12px] text-[var(--on-surface-variant)]">«Рядом и готова слушать»</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 text-[13px] text-[var(--on-surface-variant)]">
          <Link href="/settings" className="inline-flex items-center gap-2 hover:text-[var(--on-surface)] transition vp-press">
            <Icon name="settings" size={18} />
            Настройки
          </Link>
          <span className="mx-2 opacity-30">·</span>
          <Link href="/help" className="inline-flex items-center gap-2 hover:text-[var(--on-surface)] transition vp-press">
            <Icon name="favorite" size={18} />
            Помощь
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 pb-24 lg:pb-12">
        {children}
        {chatOpen ? (
          <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-[min(420px,calc(100vw-2rem))] z-40 shadow-[var(--shadow-2)] rounded-3xl overflow-hidden">
            <MayaChatPanel />
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Открыть чат Майи"
          onClick={() => setChatOpen((v) => !v)}
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 size-14 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] grid place-items-center shadow-[var(--shadow-2)] hover:bg-[var(--primary-hover)] transition vp-press z-50"
          style={chatOpen ? { display: "none" } : undefined}
        >
          <Icon name="support_agent" size={24} />
        </button>
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 gap-1 px-2 pt-2 pb-3 bg-[var(--surface-container-lowest)]/95 backdrop-blur border-t border-[rgba(61,50,42,0.06)]">
        {bottomNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 h-14 rounded-2xl",
                active ? "bg-[var(--primary-track)] text-[var(--primary-600)]" : "text-[var(--on-surface-variant)]"
              )}
            >
              <Icon name={item.icon} size={22} filled={active} />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/today" className="flex items-center gap-3 px-2 vp-press">
      <span className="size-11 rounded-2xl bg-[var(--primary-500)] grid place-items-center text-[var(--on-primary)]">
        <Icon name="spa" size={22} />
      </span>
      <span className="leading-tight">
        <span className="block font-bold text-[18px]">ВайбПлан</span>
        <span className="block text-[11px] text-[var(--on-surface-variant)] mt-0.5">Анти-выгорание · ЕГЭ · Майя</span>
      </span>
    </Link>
  );
}