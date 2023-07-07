import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import SSITable from "pergamos/components/ssiComponents/ssiTable";

const SSIListPage: NextPageWithLayout = () => {
  const { data } = api.ssi.getAll.useQuery({});
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs pages={[{ name: "SSIs", href: "/dashboard/ssi" }]} />
      <div className="container mx-auto py-6">
        <SSITable data={data} />
      </div>
    </main>
  );
};

SSIListPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SSIListPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.ssi.getAll.prefetch({});

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
