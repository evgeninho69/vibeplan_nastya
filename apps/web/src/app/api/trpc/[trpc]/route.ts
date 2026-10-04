import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/router";
import { currentUserId } from "@/server/auth";
import { auth } from "@/server/auth";

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth();
      const headers = req.headers;
      return {
        headers,
        session,
        userId: await currentUserId(),
      };
    },
    onError({ error, path }) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV !== "test") console.error(`[tRPC] ${path}: ${error.message}`);
    },
  });

export { handler as GET, handler as POST };