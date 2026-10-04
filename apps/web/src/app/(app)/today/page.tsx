import { PageHeader } from "@/components/PageHeader";
import { VibeOfTheDay } from "@/components/today/VibeOfTheDay";
import { PlanOfTheDay } from "@/components/today/PlanOfTheDay";
import { CodifierCard } from "@/components/today/CodifierCard";
import { SelfCareCard } from "@/components/today/SelfCareCard";
import { KseniaCard, MayaNudge } from "@/components/today/KseniaCard";
import { ToolsSection } from "@/components/today/ToolsSection";
import { MOCK_TODAY } from "@vibeplan/db/mock";

/**
 * Главный экран «Сегодня». Точно повторяет раскладку мокапа coffee_vanilla_matcha_1:
 * 12-колонная сетка, верхняя «Вайб дня», три колонки:
 *   - План на день (центральная, широкая)
 *   - Кодификатор ЕГЭ + Ксюша (правая верхняя/нижняя)
 *   - Забота о себе + книжный дневник (правая)
 * На мобиле — single-column stack.
 */
export default function TodayPage() {
  return (
    <>
      <PageHeader
        date={MOCK_TODAY}
        vibe="мягкий фокус"
        pageTitle="Сегодня"
      />

      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        {/* Top row: vibe of the day */}
        <div className="mb-6">
          <VibeOfTheDay />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Left column: Maya nudge (desktop) */}
          <div className="hidden lg:block lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-6 flex flex-col gap-5">
              <MayaNudge />
            </div>
          </div>

          {/* Center column: Plan of the day */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-5">
            <PlanOfTheDay />
            {/* Mobile-only Maya nudge */}
            <div className="lg:hidden">
              <MayaNudge />
            </div>
          </div>

          {/* Right column: codifier + self-care + ksenia */}
          <div className="lg:col-span-3 order-3 flex flex-col gap-5">
            <CodifierCard />
            <SelfCareCard />
            <KseniaCard />
          </div>
        </div>

        {/* Tools: Pomodoro + Voice */}
        <ToolsSection />

        {/* Subtle footer */}
        <p className="mt-12 text-center text-[12px] text-[var(--on-surface-variant)]">
          «Ты делаешь всё правильно. Даже маленький шаг — это уже движение вперёд» · ВайбПлан v0.1
        </p>
      </div>
    </>
  );
}