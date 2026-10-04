"use client";

import { Card, Icon, PillButton, Avatar } from "@vibeplan/ui";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

type Friend = {
  id: string;
  handle: string;
  displayName: string;
  online: boolean;
};

type Overlap = {
  friendId: string;
  window: { startsAt: string; endsAt: string };
  suggestion: string;
  match: number;
};

export function FriendsView() {
  const { data: friends = [] } = trpc.friends.list.useQuery();
  const { data: overlaps = [] } = trpc.friends.overlaps.useQuery(undefined);
  const { data: rooms = [] } = trpc.friends.rooms.useQuery();
  const inviteMutation = trpc.friends.invite.useMutation();

  const [invitedTo, setInvitedTo] = useState<string | null>(null);

  function handleInvite(o: Overlap) {
    inviteMutation.mutate(
      { friendId: o.friendId, windowStartsAt: o.window.startsAt, windowEndsAt: o.window.endsAt },
      {
        onSuccess: () => setInvitedTo(o.friendId),
        onSettled: () => setTimeout(() => setInvitedTo(null), 3000),
      }
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 vp-stagger">
      <Card variant="paper" pad="md" className="lg:col-span-7">
        <header className="flex items-center gap-3 mb-3">
          <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--primary-track)] text-[var(--primary-500)]">
            <Icon name="event_available" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Свободные окошки</h3>
          <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--primary-track)] text-[var(--primary-500)] text-[12px] font-semibold">
            {overlaps.length} совпадений
          </span>
        </header>
        <p className="text-[13px] text-[var(--on-surface-variant)] mb-3">
          ИИ Майя сопоставляет твои окна между школой, вебинарами и греблей с расписанием друзей.
        </p>

        <ul className="flex flex-col gap-2 mt-4">
          {overlaps.map((o) => {
            const friend = (friends as Friend[]).find((f) => f.id === o.friendId);
            if (!friend) return null;
            const matchPct = Math.round(o.match * 100);
            const isInvited = invitedTo === o.friendId;
            return (
              <li key={o.friendId} className="flex items-center gap-3 p-4 rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-1)]">
                <Avatar name={friend.displayName} size="md" status={friend.online ? "online" : "offline"} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] flex items-center gap-2 flex-wrap">
                    {friend.displayName}
                    <span className="text-[var(--on-surface-variant)] font-medium text-[12px]">{friend.handle}</span>
                    <span className={"inline-flex items-center px-2 h-6 rounded-full text-[11px] font-semibold " + (matchPct === 100 ? "bg-[var(--primary-track)] text-[var(--primary-500)]" : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]")}>
                      {matchPct === 100 ? "100% Match" : `${matchPct}% match`}
                    </span>
                  </div>
                  <div className="text-[13px] text-[var(--on-surface-variant)] mt-1">
                    <span className="tabular-nums">{o.window.startsAt}–{o.window.endsAt}</span> · {o.suggestion}
                  </div>
                </div>
                <PillButton
                  variant={isInvited ? "soft" : "primary"}
                  size="sm"
                  onClick={() => handleInvite(o)}
                  disabled={inviteMutation.isPending}
                >
                  {isInvited ? (
                    <><Icon name="check" size={14} /> Отправлено</>
                  ) : (
                    <><Icon name="send" size={14} /> Инвайт</>
                  )}
                </PillButton>
              </li>
            );
          })}
          {overlaps.length === 0 ? (
            <li className="rounded-2xl bg-[var(--surface-container-low)] p-6 text-center text-[13px] text-[var(--on-surface-variant)]">
              Свободных окошек пока нет. Позови друзей по handle в боковой панели.
            </li>
          ) : null}
        </ul>
      </Card>

      <Card variant="paper" pad="md" className="lg:col-span-5">
        <header className="flex items-center gap-3 mb-3">
          <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--secondary-100)] text-[var(--secondary-500)]">
            <Icon name="headphones" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Тихий совместный фокус</h3>
          <span className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-[var(--secondary-100)] text-[var(--secondary-500)] text-[12px] font-semibold">
            25/5 Lofi
          </span>
        </header>
        <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
          Без камер и давления. Слышим только тихие клики мышки и шорох страниц.
        </p>

        {rooms[0] ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              {rooms[0].participants.map((p) => (
                <div key={p.name} className="rounded-2xl border border-[rgba(61,50,42,0.06)] bg-[var(--surface-container-low)] p-3 text-center">
                  <Avatar name={p.name} size="md" />
                  <div className="text-[12px] font-semibold mt-2">{p.name}</div>
                  <div className="text-[11px] text-[var(--on-surface-variant)]">{p.status === "focus" ? "В фокусе" : p.status === "reading" ? "Чтение" : p.status}</div>
                </div>
              ))}
              <button className="rounded-2xl border border-dashed border-[rgba(61,50,42,0.18)] bg-[var(--surface-container-lowest)] p-3 text-center vp-press hover:bg-[var(--surface-container-low)] transition">
                <Icon name="person_add" size={28} className="text-[var(--on-surface-variant)] mx-auto mt-2" />
                <div className="text-[12px] font-semibold mt-2">Пригласить</div>
              </button>
            </div>
            <PillButton variant="secondary" size="md" fullWidth className="mt-4">
              <Icon name="login" size={18} /> Войти в коворкинг-комнату
            </PillButton>
          </>
        ) : (
          <PillButton variant="secondary" size="md" fullWidth>
            <Icon name="add" size={18} /> Создать коворкинг-комнату
          </PillButton>
        )}
      </Card>

      <Card variant="paper" pad="md" className="lg:col-span-12">
        <header className="flex items-center gap-3 mb-3">
          <span className="inline-grid place-items-center size-9 rounded-2xl bg-[var(--surface-container)] text-[var(--tertiary-600)]">
            <Icon name="group" size={20} />
          </span>
          <h3 className="font-semibold text-[18px] flex-1">Близкий круг</h3>
          <span className="text-[12px] text-[var(--on-surface-variant)]">{(friends as Friend[]).length} человека</span>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(friends as Friend[]).map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface-container-low)]">
              <Avatar name={f.displayName} size="md" status={f.online ? "online" : "offline"} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] truncate">{f.displayName}</div>
                <div className="text-[12px] text-[var(--on-surface-variant)] truncate">{f.handle}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}