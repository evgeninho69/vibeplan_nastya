import { NextResponse } from "next/server";
import { MOCK_TODAY } from "@vibeplan/db/mock";

/**
 * Экспорт сессий текущего дня в формате iCalendar (.ics).
 * Импортируется в Apple Calendar, Google Calendar, Outlook.
 */
export async function GET() {
  // В Phase 9: данные из БД через getTodaySchedule.
  // Сейчас — стаб, чтобы UI/интеграция сразу работала.
  const events: Array<{ title: string; start: string; end: string; description?: string; location?: string }> = [
    {
      title: "Школа (6 уроков)",
      start: `${MOCK_TODAY}T083000`,
      end: `${MOCK_TODAY}T141500`,
      description: "6 уроков. Конспект по физике в каб. 304 успешно сдан на оценку «5».",
    },
    {
      title: "Профильная математика: Планиметрия №16",
      start: `${MOCK_TODAY}T153000`,
      end: `${MOCK_TODAY}T173000`,
      description: "Онлайн-школа «Умскул». Разбор окружностей и вписанных углов.",
    },
    {
      title: "Матча в «Слой» с Ксюшей",
      start: `${MOCK_TODAY}T180000`,
      end: `${MOCK_TODAY}T190000`,
      location: "Кофейня «Слой», ул. Маяковского 12",
      description: "ИИ нашёл совпадение в графиках! Обсудить пробники и эскизы худи.",
    },
    {
      title: "Гребной клуб: тренировка",
      start: `${MOCK_TODAY}T193000`,
      end: `${MOCK_TODAY}T204500`,
      description: "Разгрузка спины, серия 4×1000м в мягком аэробном темпе + растяжка.",
    },
    {
      title: "Пошив оверсайз-худи + 3D-печать клипс",
      start: `${MOCK_TODAY}T211500`,
      end: `${MOCK_TODAY}T220000`,
      description: "Проверить напечатанные люверсы на Anycubic, раскрой японского футера.",
    },
  ];

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VibePlan//v0.1//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ВайбПлан — Четверг",
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${Math.random().toString(36).slice(2)}@vibeplan.app`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcsDate(e.start)}`,
      `DTEND:${formatIcsDate(e.end)}`,
      `SUMMARY:${escapeIcs(e.title)}`,
      e.description ? `DESCRIPTION:${escapeIcs(e.description)}` : "",
      e.location ? `LOCATION:${escapeIcs(e.location)}` : "",
      "END:VEVENT",
    ]).filter(Boolean),
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="vibeplan-${MOCK_TODAY}.ics"`,
    },
  });
}

function formatIcsDate(input: string): string {
  // input: "2025-10-24T180000" -> "20251024T180000"
  return input.replace(/[-:]/g, "");
}

function formatIcs(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}