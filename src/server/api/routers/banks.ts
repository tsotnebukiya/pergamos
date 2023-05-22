import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { regexUrl } from "pergamos/utils/utils";

export const banksRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const bank = await ctx.prisma.bank.findUniqueOrThrow({
        where: {
          id: input.id,
        },

        select: {
          id: true,
          name: true,
          website: true,
          image: true,
          active: true,
          amending: true,

          audits: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            where: {
              status: "PENDING",
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
      return bank;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const bank = await ctx.prisma.bank.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        active: true,
        amending: true,
        website: true,
        _count: {
          select: { teams: true },
        },
        makerUser: {
          select: { id: true, name: true },
        },
        checkerUser: {
          select: { id: true, name: true },
        },
      },
    });
    return bank;
  }),
  create: protectedProcedure
    .input(
      z.object({
        website: z.string().regex(regexUrl, "Invalid URL"),
        name: z.string().min(3, "Name must be at least 3 characters long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const makerId = ctx.session.user.id;
      const existingBank = await ctx.prisma.bank.findFirst({
        where: {
          OR: [{ name: input.name }, { website: input.website }],
        },
      });
      if (existingBank)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank already exists",
        });

      const bank = await ctx.prisma.bank.create({
        data: {
          name: input.name,
          website: input.website,
          maker: makerId,
        },
      });
      if (!bank)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create bank",
        });
      return bank;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingBank = await ctx.prisma.bank.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (existingBank.maker === ctx.session.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maker/Checker cannot be the same user",
        });
      if (existingBank.active)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank is already active",
        });
      const updatedBank = await ctx.prisma.bank.update({
        where: {
          id: input.id,
        },
        data: {
          active: true,
          checker: ctx.session.user.id,
        },
      });
      if (!updatedBank)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to activate bank",
        });
      return updatedBank;
    }),
  amend: protectedProcedure
    .input(
      z.object({
        bankId: z.number(),
        details: z
          .object({
            name: z.string().optional(),
            website: z.string().optional(),
          })
          .refine(
            (data) =>
              Object.values(data).some(
                (val) => val !== undefined && val !== null
              ),
            {
              message: "At least one property must be present",
            }
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingBank = await ctx.prisma.bank.findFirst({
        where: {
          OR: [
            ...(input.details.name ? [{ name: input.details.name }] : []),
            ...(input.details.website
              ? [{ website: input.details.website }]
              : []),
          ],
        },
      });
      if (existingBank) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank already exists",
        });
      }
      const bank = await ctx.prisma.bank.findUniqueOrThrow({
        where: { id: input.bankId },
      });

      if (!bank.active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: " Bank is not active",
        });
      }
      if (bank.amending) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank is already being amended",
        });
      }
      console.log(ctx.session.user.id);
      const data = {
        bank: input.bankId,
        maker: ctx.session.user.id,
        ...(input.details.name ? { name: input.details.name } : {}),
        ...(input.details.website ? { website: input.details.website } : {}),
      };
      const createBankAudit = await ctx.prisma.bankAudit.create({
        data,
      });
      await ctx.prisma.bank.update({
        where: {
          id: input.bankId,
        },
        data: {
          amending: true,
        },
      });
      return createBankAudit;
    }),
  amendChecker: protectedProcedure
    .input(
      z.object({
        bankId: z.number(),
        amendId: z.number(),
        action: z.enum(["APPROVE", "REJECT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bank = await ctx.prisma.bank.findUniqueOrThrow({
        where: { id: input.bankId },
      });
      const bankAudit = await ctx.prisma.bankAudit.findUniqueOrThrow({
        where: { id: input.amendId },
      });
      if (bankAudit.checker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Amendment already approved",
        });
      }
      if (bankAudit.maker === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maker/Checker cannot be the same user",
        });
      }
      if (input.action === "REJECT") {
        const updateBankAudit = await ctx.prisma.bankAudit.update({
          where: { id: input.amendId },
          data: {
            checker: ctx.session.user.id,
            status: "REJECTED",
          },
        });
        await ctx.prisma.bank.update({
          where: {
            id: input.bankId,
          },
          data: {
            amending: false,
          },
        });
        return updateBankAudit;
      }
      const updateBankAudit = await ctx.prisma.bankAudit.update({
        where: { id: input.amendId },
        data: {
          checker: ctx.session.user.id,
          status: "APPROVED",
        },
      });
      await ctx.prisma.bank.update({
        where: {
          id: input.bankId,
        },
        data: {
          amending: false,
          ...(bankAudit.name ? { name: bankAudit.name } : {}),
          ...(bankAudit.website ? { website: bankAudit.website } : {}),
        },
      });
      return updateBankAudit;
    }),
});
