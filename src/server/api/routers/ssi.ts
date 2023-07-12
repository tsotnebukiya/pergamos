import { number, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getDownloadPromise,
  getUploadPromise,
} from "pergamos/utils/uploadfile";
const ssiSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters long"),
  currency: z.string().min(3, "Must be at least 3 characters long"),
  field56Institution: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  field57Institution: z.string().min(3, "Must be at least 3 characters long"),
  field57Account: z.string().min(3, "Must be at least 3 characters long"),
  field58Institution: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  field58Account: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  furtherCreditTo: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  assignedBroker: z.string(),
  assignedTeam: z.string(),
  backup: z
    .object({
      type: z.string().min(3, "Upload a file"),
      name: z.string().min(3, "Upload a file"),
    })
    .refine((data) => (data.name && data.type) || (!data.name && !data.type), {
      message:
        "Either provide both backup.name and backup.type, or leave both empty",
    }),
  backupTag: z.string().min(3, "Must be at least 3 characters long"),
});

export const ssiRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ name: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = (await getUploadPromise(input.name, input.type)) as string;
      return url;
    }),
  createOne: protectedProcedure
    .input(ssiSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input.backup.name, input.backup.type, input.backupTag);
      const file = await ctx.prisma.file.create({
        data: {
          name: input.backup.name,
          type: input.backup.type,
          s3Id: input.backupTag,
        },
      });
      if (!file) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create file",
        });
      }
      const ssi = await ctx.prisma.sSI.create({
        data: {
          field57Account: input.field57Account,
          field57Institution: input.field57Institution,
          field58Account: input.field58Account,
          field58Institution: input.field58Institution,
          field56Institution: input.field56Institution,
          furtherCreditTo: input.furtherCreditTo,
          name: input.name,
          currency: input.currency,
          makerUser: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          assignedFile: {
            connect: {
              id: file.id,
            },
          },
          citiTeam: {
            connect: {
              id: Number(input.assignedTeam),
            },
          },
          brokerId: {
            connect: {
              id: Number(input.assignedBroker),
            },
          },
        },
      });
      return ssi;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ssi = await ctx.prisma.sSI.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          status: true,
          name: true,
          checkerUser: {
            select: {
              name: true,
              id: true,
            },
          },
          makerUser: {
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
          brokerId: {
            select: {
              name: true,
              id: true,
              bank: true,
            },
          },
          assignedFile: {
            select: {
              name: true,
              s3Id: true,
            },
          },
          currency: true,
          field56Institution: true,
          field57Account: true,
          field57Institution: true,
          field58Account: true,
          field58Institution: true,
          furtherCreditTo: true,
        },
      });
      return ssi;
    }),

  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingSSI = await ctx.prisma.sSI.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (existingSSI.maker === ctx.session.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maker/Checker cannot be the same user",
        });
      if (existingSSI.status === "APPROVED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "SSI is already approved",
        });
      const updatedSSI = await ctx.prisma.sSI.update({
        where: {
          id: input.id,
        },
        data: {
          status: "APPROVED",
          checker: ctx.session.user.id,
        },
      });
      if (!updatedSSI)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to activate bank",
        });
      return updatedSSI;
    }),
  downloadFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.findUniqueOrThrow({
        where: {
          name: input.id,
        },
      });
      const url = (await getDownloadPromise(file.name)) as string;
      return { url, filename: file.name };
    }),
  getAll: protectedProcedure
    .input(z.object({ brokerId: number().optional() }))
    .query(async ({ ctx, input }) => {
      let whereCondition = {}; // Empty object for the where condition
      if (input.brokerId !== undefined) {
        whereCondition = { brokerId: input.brokerId };
      }
      const ssi = await ctx.prisma.sSI.findMany({
        where: {
          brokerId: whereCondition,
        },
        select: {
          id: true,
          status: true,
          name: true,
          checkerUser: {
            select: {
              name: true,
              id: true,
            },
          },
          makerUser: {
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
          brokerId: {
            select: {
              name: true,
              id: true,
              bank: true,
            },
          },
          assignedFile: {
            select: {
              name: true,
              s3Id: true,
            },
          },
          currency: true,
          field56Institution: true,
          field57Account: true,
          field57Institution: true,
          field58Account: true,
          field58Institution: true,
          furtherCreditTo: true,
        },
      });
      return ssi;
    }),
});
