import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { exchangeRate } from "pergamos/utils/rate";

const schema = z.object({
  assignedBroker: z.number(),
  assignedTeam: z.number(),
  assignedSsi: z.string(),
  purpose: z.string(),
  amount: z.number(),
  relatedTrade: z.string().optional(),
  appNotification: z.boolean(),
  emailNotification: z.boolean(),
  valueDate: z.date(),
  receiverInformation: z.string(),
});

export const paymentsRouter = createTRPCRouter({
  create: protectedProcedure.input(schema).mutation(async ({ ctx, input }) => {
    const ssi = await ctx.prisma.sSI.findUniqueOrThrow({
      where: {
        id: input.assignedSsi,
      },
      select: {
        currency: true,
      },
    });
    let usdAmount: number = input.amount;
    if (ssi.currency !== "usd") {
      usdAmount = await exchangeRate(input.amount, ssi.currency);
    }
    const payment = await ctx.prisma.payment.create({
      data: {
        amount: input.amount,
        amountUSD: usdAmount,
        valueDate: input.valueDate,
        receiverInformation: input.receiverInformation,
        relatedTrade: input.relatedTrade !== "" ? input.relatedTrade : null,
        appNotification: input.appNotification,
        emailNotification: input.emailNotification,
        broker: {
          connect: {
            id: input.assignedBroker,
          },
        },
        purpose: input.purpose,
        ssi: {
          connect: {
            id: input.assignedSsi,
          },
        },
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
      },
    });
    await ctx.prisma.paymentAudit.create({
      data: {
        paymentId: {
          connect: {
            id: payment.id,
          },
        },
        makerUser: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        type: "CREATE",
      },
    });
    return payment;
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const broker = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          ssi: {
            include: {
              assignedFile: true,
            },
          },
          audit: {
            include: {
              makerUser: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          },
          broker: {
            select: {
              name: true,
              market: true,
              id: true,
              bank: true,
            },
          },
          checkerUserI: {
            select: {
              name: true,
              id: true,
            },
          },
          makerUser: {
            select: {
              id: true,
              name: true,
            },
          },
          checkerUserII: {
            select: {
              name: true,
              id: true,
            },
          },
          citiTeam: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      return broker;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const payment = await ctx.prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ssi: {
          select: {
            currency: true,
          },
        },
        citiTeam: {
          select: {
            name: true,
            id: true,
          },
        },
        broker: {
          select: {
            name: true,
            id: true,
            bank: true,
          },
        },
      },
    });
    return payment;
  }),
  activate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingBroker = await ctx.prisma.broker.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (existingBroker.maker === ctx.session.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maker/Checker cannot be the same user",
        });
      if (existingBroker.active)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank is already active",
        });
      const updatedBroker = await ctx.prisma.broker.update({
        where: {
          id: input.id,
        },
        data: {
          active: true,
          checker: ctx.session.user.id,
        },
      });
      if (!updatedBroker)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to activate bank",
        });
      return updatedBroker;
    }),
  amend: protectedProcedure
    .input(
      z.object({
        brokerId: z.number(),
        details: z
          .object({
            name: z.string().optional(),
            market: z.string().optional(),
            assignedTeam: z.number().optional(),
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
      console.log("1");
      const existingBroker = await ctx.prisma.bank.findFirst({
        where: {
          OR: [...(input.details.name ? [{ name: input.details.name }] : [])],
        },
      });
      if (existingBroker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Broker already exists",
        });
      }
      console.log("2");
      const broker = await ctx.prisma.broker.findUniqueOrThrow({
        where: { id: input.brokerId },
      });

      if (!broker.active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: " Broker is not active",
        });
      }
      if (broker.amending) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bank is already being amended",
        });
      }
      const data = {
        broker: input.brokerId,
        maker: ctx.session.user.id,
        ...(input.details.name ? { name: input.details.name } : {}),
        ...(input.details.market ? { market: input.details.market } : {}),
        ...(input.details.assignedTeam
          ? { assignedTeam: input.details.assignedTeam }
          : {}),
      };
      const createBrokerAudit = await ctx.prisma.brokerAudit.create({
        data,
      });
      await ctx.prisma.broker.update({
        where: {
          id: input.brokerId,
        },
        data: {
          amending: true,
        },
      });
      return createBrokerAudit;
    }),
  amendChecker: protectedProcedure
    .input(
      z.object({
        brokerId: z.number(),
        amendId: z.number(),
        action: z.enum(["APPROVE", "REJECT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.broker.findUniqueOrThrow({
        where: { id: input.brokerId },
      });
      const brokerAudit = await ctx.prisma.brokerAudit.findUniqueOrThrow({
        where: { id: input.amendId },
      });
      if (brokerAudit.checker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Amendment already approved",
        });
      }
      if (brokerAudit.maker === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maker/Checker cannot be the same user",
        });
      }
      if (input.action === "REJECT") {
        const updateBrokerAudit = await ctx.prisma.brokerAudit.update({
          where: { id: input.amendId },
          data: {
            checker: ctx.session.user.id,
            status: "REJECTED",
          },
        });
        await ctx.prisma.broker.update({
          where: {
            id: input.brokerId,
          },
          data: {
            amending: false,
          },
        });
        return updateBrokerAudit;
      }
      const updateBrokerAudit = await ctx.prisma.brokerAudit.update({
        where: { id: input.amendId },
        data: {
          checker: ctx.session.user.id,
          status: "APPROVED",
        },
      });
      await ctx.prisma.broker.update({
        where: {
          id: input.brokerId,
        },
        data: {
          amending: false,
          ...(brokerAudit.name ? { name: brokerAudit.name } : {}),
          ...(brokerAudit.assignedTeam
            ? { assignedTeam: brokerAudit.assignedTeam }
            : {}),
          ...(brokerAudit.market ? { market: brokerAudit.market } : {}),
        },
      });
      return updateBrokerAudit;
    }),
  createItem: protectedProcedure
    .input(
      z.object({
        type: z.enum(["Email", "Phone", "Account"]),
        values: z.array(z.string()),
        brokerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const broker = await ctx.prisma.broker.findUniqueOrThrow({
        where: { id: input.brokerId },
      });
      if (!broker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Broker does not exist",
        });
      }
      if (!broker.active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Broker is not active",
        });
      }
      if (input.type === "Email") {
        const emails = await ctx.prisma.contactEmail.createMany({
          data: input.values.map((value) => ({
            broker: input.brokerId,
            email: value,
          })),
        });
        return emails;
      }
      if (input.type === "Account") {
        const accounts = await ctx.prisma.brokerAccounts.createMany({
          data: input.values.map((value) => ({
            broker: input.brokerId,
            account: value,
          })),
        });
        return accounts;
      }
      if (input.type === "Phone") {
        const phones = await ctx.prisma.contactPhone.createMany({
          data: input.values.map((value) => ({
            broker: input.brokerId,
            phone: value,
          })),
        });
        return phones;
      }
    }),
  deleteItem: protectedProcedure
    .input(
      z.object({
        type: z.enum(["Email", "Phone", "Account"]),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "Email") {
        const emails = await ctx.prisma.contactEmail.delete({
          where: { id: input.id },
        });
        return emails;
      }
      if (input.type === "Account") {
        const emails = await ctx.prisma.brokerAccounts.delete({
          where: { id: input.id },
        });
        return emails;
      }
      if (input.type === "Phone") {
        const emails = await ctx.prisma.contactPhone.delete({
          where: { id: input.id },
        });
        return emails;
      }
    }),
});