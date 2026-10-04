import { PageHeader } from "@/components/PageHeader";
import { EgeView } from "@/components/ege/EgeView";
import { MOCK_TODAY } from "@vibeplan/db/mock";

export default function EgePage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="ЕГЭ &amp; Учёба 📚" />
      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        <EgeView />
      </div>
    </>
  );
}