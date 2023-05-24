import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";

const schema = z.object({
  bankId: z.number().min(1, "Bank is required"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  market: z.string().nonempty("Market is required"),
  assignedTeam: z.number().min(1, "Team is required"),
  accounts: z.array(z.number().min(1, "Account is required")),
});

export const brokersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema)
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async ({ ctx, input }) => {
      const bank = await ctx.prisma.bank.findUniqueOrThrow({
        where: {
          id: input.bankId,
        },
      });
      if (!bank.active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank is not active",
        });
      }
      const broker = await ctx.prisma.broker.create({
        data: {
          name: input.name,
          market: input.market,
          citiTeam: {
            connect: {
              id: input.assignedTeam,
            },
          },
          makerUser: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          bankId: {
            connect: {
              id: input.bankId,
            },
          },
        },
      });
      return broker;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const broker = await ctx.prisma.broker.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          active: true,
          bankId: {
            select: {
              name: true,
              id: true,
            },
          },
          makerUser: {
            select: { id: true, name: true },
          },
          checkerUser: {
            select: { id: true, name: true },
          },
        },
      });
      return broker;
    }),
});
