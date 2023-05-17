import { createTRPCRouter } from "pergamos/server/api/trpc";
import { banksRouter } from "pergamos/server/api/routers/banks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  banks: banksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
