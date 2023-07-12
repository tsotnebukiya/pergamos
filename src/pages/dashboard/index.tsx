import { useEffect, type ReactElement } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import MyChart from "pergamos/components/charts/mychart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import PieChart from "pergamos/components/charts/PieChart";
import HeatMap from "pergamos/components/charts/HeatMap";
import TreeMap from "pergamos/components/charts/TreeMap";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "pergamos/components/UI/Tabs";
import GeneralStatus from "pergamos/components/dashboardComp/GeneralStats";
import SecondaryStats from "pergamos/components/dashboardComp/SecondaryStats";
import Analytics from "pergamos/components/dashboardComp/Analytics";
import { createHelpers } from "pergamos/utils/helpers";
import { GetServerSideProps } from "next";
import { api } from "pergamos/utils/api";

const DashboardPage: NextPageWithLayout = () => {
  const { data } = api.payments.dashboard.useQuery();
  if (!data) return null;
  return (
    <>
      <div className="container mx-auto py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 mt-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="related">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <GeneralStatus data={data.generalStats} />
            <SecondaryStats data={data.secondaryStats} />
          </TabsContent>
          <TabsContent value="related">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.payments.dashboard.prefetch();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
