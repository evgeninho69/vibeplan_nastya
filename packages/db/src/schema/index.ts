import { users } from "./users";
import { egeModules, egeTopics, egeProgress, userSubjects, mockExams } from "./ege";
import { schedules, lessons } from "./school";
import { sessions, pomodoros } from "./sessions";
import { habits, habitLogs } from "./habits";
import { memoryAnchors, dailyVibes, chatMessages } from "./maya";
import { friends, focusRooms, integrations } from "./social";

export * from "./users";
export * from "./ege";
export * from "./school";
export * from "./sessions";
export * from "./habits";
export * from "./maya";
export * from "./social";

export const schema = {
  users,
  userSubjects,
  egeModules,
  egeTopics,
  egeProgress,
  mockExams,
  schedules,
  lessons,
  sessions,
  pomodoros,
  habits,
  habitLogs,
  memoryAnchors,
  dailyVibes,
  chatMessages,
  friends,
  focusRooms,
  integrations,
};