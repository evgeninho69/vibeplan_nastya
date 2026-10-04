import Link from "next/link";
import { Card, Icon } from "@vibeplan/ui";
import { APP_NAME } from "@vibeplan/shared";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center px-5 py-10 bg-[var(--background)]">
      <Card variant="sticker" pad="lg" className="w-full max-w-md text-center">
        <div className="mx-auto size-16 rounded-3xl grid place-items-center mb-4 bg-[var(--surface-container)] text-[var(--tertiary-600)]">
          <Icon name="explore_off" size={28} />
        </div>
        <h1 className="font-bold text-[28px] tracking-[-0.015em] mb-2">
          Похоже, ты свернул не туда
        </h1>
        <p className="text-[14px] text-[var(--on-surface-variant)] mb-6 leading-relaxed">
          Этой страницы нет в {APP_NAME}. Может, она была в плане — но ещё не реализована, или ссылка устарела.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Link
            href="/today"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] font-semibold text-[13px] shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="home" size={18} />
            На главную
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[var(--on-surface)] font-semibold text-[13px] shadow-[var(--shadow-1)] vp-press"
          >
            <Icon name="help" size={18} />
            Помощь
          </Link>
        </div>
      </Card>
    </div>
  );
}