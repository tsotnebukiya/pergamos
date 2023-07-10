import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import SSITable from "pergamos/components/ssiComponents/ssiTable";
import PaymentsTable from "pergamos/components/paymentComponents/PaymentsTable";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import Spinner from "pergamos/components/UI/Spinner";

const PaymentsTablePage: NextPageWithLayout = () => {
  const { data } = api.payments.getAll.useQuery();
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs
        pages={[{ name: "Payments", href: "/dashboard/payments" }]}
      />
      <div className="container mx-auto py-6">
        {/* {!data ? <Spinner /> : <PaymentsTable data={data} />} */}
        <PaymentsTable data={data} />
      </div>
    </main>
  );
};

PaymentsTablePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default PaymentsTablePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.payments.getAll.prefetch();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
