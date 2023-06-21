import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "pergamos/server/api/trpc";
import { TRPCError } from "@trpc/server";
import getUploadPromise from "pergamos/utils/uploadfile";
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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.citiTeam.findMany();
    return teams;
  }),
  uploadFile: protectedProcedure
    .input(z.object({ name: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = (await getUploadPromise(input.name, input.type)) as string;
      return url;
    }),
  createOne: protectedProcedure
    .input(ssiSchema)
    .mutation(async ({ ctx, input }) => {
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
});
