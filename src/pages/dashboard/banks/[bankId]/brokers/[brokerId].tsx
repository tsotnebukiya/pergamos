import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import { api } from "pergamos/utils/api";
import { useRouter } from "next/router";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import { Button } from "pergamos/components/UI/Button";
import { Tabs } from "pergamos/components/UI/Tabs";
import { TabsList } from "pergamos/components/UI/Tabs";
import { TabsTrigger } from "pergamos/components/UI/Tabs";
import { TabsContent } from "pergamos/components/UI/Tabs";
import BrokerRelated from "pergamos/components/brokerComponents/BrokerRelated";
import BrokerOverview from "pergamos/components/brokerComponents/BrokerOverview";

const BrokerOverviewPage: NextPageWithLayout = () => {
  const query = useRouter().query.brokerId;
  const { data } = api.brokers.getOne.useQuery({ id: Number(query) });
  console.log(data);

  if (!data) return null;
  return (
    <main>
      <BreadCrumbs
        pages={[
          { name: "Banks", href: "/dashboard/banks" },
          {
            name: `${data.bankId.name}`,
            href: `/dashboard/banks/${data.bankId.id}`,
          },
          {
            name: `Brokers`,
            href: `/dashboard/banks/${data.bankId.id}/brokers`,
          },
          {
            name: `${data.name}`,
            href: `/dashboard/banks/${data.bankId.id}/brokers/${data.id}`,
          },
        ]}
      />
      <div className="container mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
          {!data.active ? (
            <Button size="sm">Activate</Button>
          ) : data.amending ? (
            <Button size="sm" variant="outline">
              Pending Changes
            </Button>
          ) : (
            <Button size="sm">Edit</Button>
          )}
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 mt-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <BrokerOverview broker={data} />
          </TabsContent>
          <TabsContent value="related">
            <BrokerRelated />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

BrokerOverviewPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BrokerOverviewPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.brokerId;
  console.log(id, Number(id));
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.brokers.getOne.fetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
