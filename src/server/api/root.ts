import { createTRPCRouter } from "pergamos/server/api/trpc";
import { banksRouter } from "pergamos/server/api/routers/banks";
import { brokersRouter } from "./routers/brokers";
import { teamsRouter } from "./routers/teams";
import { ssiRouter } from "./routers/ssi";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  banks: banksRouter,
  brokers: brokersRouter,
  teams: teamsRouter,
  ssi: ssiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
