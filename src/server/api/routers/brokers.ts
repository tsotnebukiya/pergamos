import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  market: z.string(),
  assignedTeam: z.number(),
  bankId: z.number(),
  account: z.array(z.string()),
});

export const brokersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema)
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async ({ ctx, input }) => {
      console.log(input);
    }),
});
