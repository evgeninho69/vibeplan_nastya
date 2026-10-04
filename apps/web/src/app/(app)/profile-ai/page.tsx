import { PageHeader } from "@/components/PageHeader";
import { ProfileAiView } from "./ProfileAiView";
import { MOCK_TODAY } from "@vibeplan/db/mock";

export default function ProfileAiPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Профиль &amp; Персонализация Майи 🌿" />
      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        <ProfileAiView />
      </div>
    </>
  );
}