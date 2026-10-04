import { PageHeader } from "@/components/PageHeader";
import { FriendsView } from "@/components/friends/FriendsView";
import { MOCK_TODAY } from "@vibeplan/db/mock";

export default function FriendsPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Компоненты &amp; Друзья ☕" />
      <div className="px-5 md:px-8 pb-12 max-w-[var(--max-width)] mx-auto">
        <FriendsView />
      </div>
    </>
  );
}