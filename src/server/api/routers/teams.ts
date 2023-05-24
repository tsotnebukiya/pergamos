import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const teamsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.citiTeam.findMany();
    return teams;
  }),
});
