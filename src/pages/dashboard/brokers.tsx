import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import BrokersTable from "pergamos/components/brokerComponents/BrokersTable";
import BrokerCreate from "pergamos/components/brokerComponents/BrokerCreate";

const BrokersPage: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false);
  const { data } = api.brokers.getAll.useQuery();
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs pages={[{ name: "Brokers", href: "/dashboard/brokers" }]} />
      <div className="container mx-auto py-6">
        <BrokersTable
          data={data}
          openSheet={() => setOpen(true)}
          pageSize={10}
        />
        {open && <BrokerCreate open={open} setOpen={setOpen} />}
      </div>
    </main>
  );
};

BrokersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BrokersPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.brokers.getAll.prefetch();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
