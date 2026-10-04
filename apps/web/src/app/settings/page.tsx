import { PageHeader } from "@/components/PageHeader";
import { Card, Icon, PillButton } from "@vibeplan/ui";
import { MOCK_TODAY } from "@vibeplan/db/mock";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Настройки ⚙️" />
      <div className="px-5 md:px-8 pb-12 max-w-3xl mx-auto flex flex-col gap-5 vp-stagger">
        <Card variant="paper" pad="md">
          <h3 className="font-semibold text-[18px] mb-3">Подключенные интеграции</h3>
          <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
            Привяжите внешние сервисы, чтобы Майя и расписание синхронизировались автоматически.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              { name: "Telegram-бот @maya_safari_bot", desc: "Утренний вайб в 07:45, напоминания за 15 мин, вечерний чек-ин в 21:30.", state: "Готов к подключению" },
              { name: "Apple Calendar / Google Cal (.ics)", desc: "Экспорт расписания школы, ЕГЭ-сессий и привычек в ваш календарь.", state: "Доступно" },
              { name: "Notion Workspace", desc: "Двухсторонняя синхронизация привычек и сессий.", state: "Доступно" },
              { name: "Яндекс.Спектр (МЭШ / ЭлЖур)", desc: "Импорт расписания школы напрямую из дневника (когда API открыто).", state: "В плане Phase 9+" },
            ].map((s) => (
              <li key={s.name} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface-container-low)]">
                <span className="size-9 rounded-2xl bg-[var(--surface-container-lowest)] grid place-items-center text-[var(--tertiary-600)]">
                  <Icon name="extension" size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px]">{s.name}</div>
                  <div className="text-[12px] text-[var(--on-surface-variant)]">{s.desc}</div>
                </div>
                <span className="inline-flex items-center px-2 h-6 rounded-full bg-[var(--surface-container)] text-[11px] font-semibold text-[var(--on-surface-variant)] whitespace-nowrap">
                  {s.state}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="paper" pad="md">
          <h3 className="font-semibold text-[18px] mb-3">Экспорт и резервные копии</h3>
          <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
            Скачайте все свои данные в виде ICS-календаря и JSON-бэкапа (GDPR/152-ФЗ).
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/api/export/today.ics"
              download
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] font-semibold text-[13px] shadow-[var(--shadow-1)] vp-press"
            >
              <Icon name="download" size={18} /> Скачать .ics
            </a>
            <a
              href="/api/export/all.json"
              download
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--surface-container-lowest)] border border-[rgba(61,50,42,0.06)] text-[var(--on-surface)] font-semibold text-[13px] shadow-[var(--shadow-1)] vp-press"
            >
              <Icon name="data_object" size={18} /> Скачать JSON-бэкап
            </a>
          </div>
        </Card>

        <Card variant="paper" pad="md">
          <h3 className="font-semibold text-[18px] mb-3">Удаление аккаунта</h3>
          <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
            Полное удаление всех персональных данных в течение 30 дней (GDPR/152-ФЗ).
          </p>
          <PillButton variant="soft" size="sm">
            <Icon name="delete" size={20} /> Запросить удаление
          </PillButton>
        </Card>

        <p className="mt-4 text-center text-[12px] text-[var(--on-surface-variant)]">
          <Link href="/today" className="underline-offset-2 hover:underline">← Вернуться в Сегодня</Link>
        </p>
      </div>
    </>
  );
}