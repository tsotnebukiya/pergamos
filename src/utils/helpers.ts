import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "pergamos/server/api/root";
import { prisma } from "pergamos/server/db";
import superjson from "superjson";
import { getServerAuthSession } from "pergamos/server/auth";
import type { GetServerSidePropsContext } from "next";

export const createHelpers = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: session },
    transformer: superjson,
  });

  return helpers;
};
