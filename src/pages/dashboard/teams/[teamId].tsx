import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";

const UserPage: NextPageWithLayout = () => {
  const query = useRouter().query.teamId as string;
  const { data } = api.teams.getOne.useQuery({ id: Number(query) });
  console.log(data);
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs
        pages={[{ name: data.name, href: `/dashboard/users/${query}` }]}
      />
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.teamId;
  console.log(id);
  if (typeof id !== "string") throw new Error("Invalid user id");
  try {
    await helper.teams.getOne.fetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }
  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
