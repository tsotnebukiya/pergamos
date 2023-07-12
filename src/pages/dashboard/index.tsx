import { useEffect, type ReactElement } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import MyChart from "pergamos/components/charts/mychart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import PieChart from "pergamos/components/charts/PieChart";
import HeatMap from "pergamos/components/charts/HeatMap";
import TreeMap from "pergamos/components/charts/TreeMap";

const DashboardPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="container mx-auto  grid grid-cols-6 gap-x-16 gap-y-4 py-6">
        <Card className="col-span-6">
          <CardHeader>
            <CardTitle>Daily Transaction Count</CardTitle>
          </CardHeader>
          <CardContent>
            <HeatMap />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Payment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>
        <Card className="col-span-4 col-start-3">
          <CardHeader>
            <CardTitle>Top 10 Banks by Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <TreeMap />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
