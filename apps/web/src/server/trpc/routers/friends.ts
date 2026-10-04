/**
 * Друзья, коворкинг-комнаты, пересечения расписаний. Phase 9.
 * Сейчас — стабы для UI.
 */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const friendsRouter = router({
  /** Список друзей пользователя. */
  list: publicProcedure.query(() => [
    { id: "f-ksusha", handle: "@ksusha", displayName: "Ксюша Дубова", online: true, availability: { Thu: [{ start: "18:00", end: "19:15" }] } },
    { id: "f-polina", handle: "@polina_v", displayName: "Полина В.", online: false, availability: { Sat: [{ start: "14:00", end: "16:00" }] } },
    { id: "f-mark",   handle: "@mark_c",   displayName: "Марк С.",     online: false, availability: { Thu: [{ start: "19:30", end: "21:00" }] } },
  ]),

  /** Пересечения расписаний («идеальные окна») на сегодня. */
  overlaps: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
    .query(() => ([
      {
        friendId: "f-ksusha",
        window: { startsAt: "18:00", endsAt: "19:15" },
        suggestion: "Кофейня «Слой», ул. Маяковского 12 — 7 мин пешком",
        match: 1.0,
      },
      {
        friendId: "f-mark",
        window: { startsAt: "19:30", endsAt: "20:45" },
        suggestion: "Гребной клуб (одна секция с Аней)",
        match: 0.85,
      },
    ])),

  /** Коворкинг-комнаты. В Phase 9 — WebSocket. Сейчас — стаб. */
  rooms: publicProcedure.query(() => [
    {
      id: "room-silent",
      name: "Тихая комната с Ксюшей",
      kind: "silent_25_5",
      participants: [{ name: "Аня", status: "focus" }, { name: "Ксюша", status: "reading" }],
      endsAt: "2025-10-24T17:30:00Z",
    },
  ]),

  /** Пригласить друга на пересечение. */
  invite: publicProcedure
    .input(z.object({ friendId: z.string(), windowStartsAt: z.string(), windowEndsAt: z.string() }))
    .mutation(async ({ input }) => {
      // В Phase 9: Telegram webhook + insert в friends_invites.
      return {
        ok: true as const,
        invite: { id: crypto.randomUUID(), ...input, sentAt: new Date() },
      };
    }),
});