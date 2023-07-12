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
  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment can only be rejected",
        });
      }
      if (payment.maker !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not authorized to cancel this payment",
        });
      }
      await ctx.prisma.paymentAudit.deleteMany({
        where: {
          payment: input.id,
        },
      });
      await ctx.prisma.payment.delete({
        where: {
          id: input.id,
        },
      });
    }),
  sendForApproval: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot send for approval at this stage",
        });
      }
      if (payment.maker !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not authorized to send for approval",
        });
      }
      await ctx.prisma.payment.update({
        where: {
          id: input.id,
        },
        data: {
          status: "SENTFORAPPROVAL",
        },
      });
      await ctx.prisma.paymentAudit.create({
        data: {
          type: "SENDFORAPPROVAL",
          payment: payment.id,
          maker: ctx.session.user.id,
        },
      });
    }),
  approve: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.status !== "SENTFORAPPROVAL") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot approve at this stage",
        });
      }
      if (payment.maker === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not authorized to approve this payment",
        });
      }
      await ctx.prisma.paymentAudit.create({
        data: {
          type: "APPROVEDCHECKERI",
          payment: payment.id,
          maker: ctx.session.user.id,
        },
      });
      if (payment.amountUSD && payment.amountUSD < 1000000) {
        await ctx.prisma.payment.update({
          where: {
            id: input.id,
          },
          data: {
            status: "APPROVED",
            checkerI: ctx.session.user.id,
          },
        });

        return payment;
      }
      await ctx.prisma.payment.update({
        where: {
          id: input.id,
        },
        data: {
          status: "SENFOROVTAPPROVAL",
          checkerI: ctx.session.user.id,
        },
      });
      return payment;
    }),
  approveOVT: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.status !== "SENFOROVTAPPROVAL") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot approve OVT at this stage",
        });
      }
      if (
        payment.maker === ctx.session.user.id ||
        payment.checkerI === ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not authorized to approve OVT this payment",
        });
      }
      await ctx.prisma.paymentAudit.create({
        data: {
          type: "APPROVEDCHECKERII",
          payment: payment.id,
          maker: ctx.session.user.id,
        },
      });
      await ctx.prisma.payment.update({
        where: {
          id: input.id,
        },
        data: {
          status: "APPROVED",
          checkerII: ctx.session.user.id,
        },
      });
      return payment;
    }),
  reject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.status === "REJECTED" || payment.status === "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot reject at this stage",
        });
      }
      if (payment.maker === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not authorized to reject this payment",
        });
      }
      await ctx.prisma.paymentAudit.create({
        data: {
          type: "REJECT",
          payment: payment.id,
          maker: ctx.session.user.id,
        },
      });
      await ctx.prisma.payment.update({
        where: {
          id: input.id,
        },
        data: {
          status: "REJECTED",
        },
      });
      return payment;
    }),
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const payments = await ctx.prisma.payment.findMany({
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
    const brokerCount = await ctx.prisma.broker.count();
    const ssiCount = await ctx.prisma.sSI.count();
    const approvedPayments = payments.filter(
      (payment) => payment.status === "APPROVED"
    );
    const pendingPayments = payments.filter(
      (payment) =>
        payment.status === "PENDING" ||
        payment.status === "SENTFORAPPROVAL" ||
        payment.status === "SENFOROVTAPPROVAL"
    );
    const totalVolume = approvedPayments.reduce((acc, curr) => {
      const amount = curr.amountUSD || 0;
      return acc + amount;
    }, 0);
    const totalPayments = approvedPayments.length;

    const audit = await ctx.prisma.paymentAudit.findMany({
      take: 10,
      where: {
        type: {
          not: "CREATE",
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      include: {
        makerUser: {
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });
    return {
      payments,

      secondaryStats: { pendingPayments, audit },
      generalStats: {
        brokerCount,
        ssiCount,
        totalVolume,
        totalPayments,
      },
    };
  }),
});
