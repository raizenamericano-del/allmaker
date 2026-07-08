import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { operationsRouter, fileHistoryRouter, analyticsRouter } from "./operations-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  operations: operationsRouter,
  fileHistory: fileHistoryRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
