import { PageHeader } from "@/components/PageHeader";
import { HabitsView } from "@/components/habits/HabitsView";
import { MOCK_TODAY } from "@vibeplan/db/mock";

export default function HabitsPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Привычки &amp; Жизнь 🌿" />
      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        <HabitsView />
      </div>
    </>
  );
}