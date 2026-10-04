import { PageHeader } from "@/components/PageHeader";
import { Card, Icon, PillButton, SubjectTag } from "@vibeplan/ui";
import { MOCK_TODAY } from "@vibeplan/db/mock";
import Link from "next/link";
import { SchoolScan } from "@/components/school/SchoolScan";

export default function SchoolPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Школьное расписание и звонки 🎒" />

      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          <SchoolScan />

          {/* Правая колонка: звонки + домашка */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Card variant="paper" pad="md">
              <header className="flex items-center gap-3 mb-3">
                <Icon name="notifications_active" size={20} className="text-[var(--tertiary-600)]" />
                <h3 className="font-semibold text-[18px] flex-1">Звонки и перемены</h3>
                <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--secondary-100)] text-[var(--secondary-500)] text-[12px] font-semibold">
                  Текущий статус
                </span>
              </header>
              <ul className="flex flex-col gap-2 mt-3">
                {[
                  { n: 1, start: "08:30", end: "09:15" },
                  { n: 2, start: "09:25", end: "10:10" },
                  { n: 3, start: "10:25", end: "11:10" },
                  { n: "Большая перемена", start: "11:10", end: "11:30", highlight: true },
                  { n: 4, start: "11:30", end: "12:15" },
                  { n: 5, start: "12:25", end: "13:10" },
                  { n: 6, start: "13:20", end: "14:05" },
                ].map((row, idx) => (
                  <li
                    key={idx}
                    className={
                      "flex items-center gap-3 px-3 h-11 rounded-2xl text-[13px] tabular-nums " +
                      ("highlight" in row && row.highlight
                        ? "bg-[var(--primary-track)] text-[var(--primary-500)] font-semibold"
                        : "bg-[var(--surface-container-low)]")
                    }
                  >
                    <span className="font-semibold w-6">{row.n}</span>
                    <span className="flex-1">{row.start} – {row.end}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="paper" pad="md">
              <header className="flex items-center gap-3 mb-3">
                <Icon name="edit_note" size={20} className="text-[var(--tertiary-600)]" />
                <h3 className="font-semibold text-[18px] flex-1">Школьная домашка</h3>
                <span className="text-[12px] text-[var(--on-surface-variant)]">не путать с ЕГЭ</span>
              </header>
              <p className="text-[13px] text-[var(--on-surface-variant)] mb-3">
                Только текущие школьные задания, для хороших четвертных без лишней суеты.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { code: "physics" as const, title: "Физика", note: "Задачи 14-2 → 14-8 из сборника Рымкевича", state: "Выполнено" },
                  { code: "prof_math" as const, title: "Алгебра & Начала анализа", note: "Параграф 18, разобрать №324 (чётные пункты)", state: "В процессе" },
                  { code: "literature" as const, title: "Литература", note: "Дочитать 5 главу романа и выписать две цитаты", state: "К пятнице" },
                ].map((hw, i) => (
                  <li key={i} className="flex items-center gap-3 px-3 h-14 rounded-2xl bg-[var(--surface-container-low)]">
                    <SubjectTag code={hw.code} className="!h-7 !text-[11px]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14px] truncate">{hw.title}</div>
                      <div className="text-[12px] text-[var(--on-surface-variant)] truncate">{hw.note}</div>
                    </div>
                    <span className="inline-flex items-center px-2 h-6 rounded-full bg-[var(--surface-container)] text-[11px] font-semibold text-[var(--on-surface-variant)]">
                      {hw.state}
                    </span>
                  </li>
                ))}
              </ul>
              <PillButton variant="soft" size="md" fullWidth className="mt-4">
                <Icon name="mic" size={18} />
                Надиктовать домашку голосом
              </PillButton>
            </Card>
          </div>
        </div>

        <p className="mt-10 text-center text-[12px] text-[var(--on-surface-variant)]">
          <Link href="/today" className="underline-offset-2 hover:underline">← Вернуться в Сегодня</Link>
        </p>
      </div>
    </>
  );
}