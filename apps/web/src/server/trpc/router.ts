import { router } from "./trpc";
import { todayRouter } from "./routers/today";
import { profileRouter } from "./routers/profile";
import { habitsRouter } from "./routers/habits";
import { egeRouter } from "./routers/ege";
import { mayaRouter } from "./routers/maya";
import { schoolRouter } from "./routers/school";
import { friendsRouter } from "./routers/friends";
import { chatRouter } from "./routers/chat";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  today: todayRouter,
  profile: profileRouter,
  habits: habitsRouter,
  ege: egeRouter,
  maya: mayaRouter,
  school: schoolRouter,
  friends: friendsRouter,
  chat: chatRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;