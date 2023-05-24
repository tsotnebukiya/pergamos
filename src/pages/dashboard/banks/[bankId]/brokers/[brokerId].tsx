import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import { api } from "pergamos/utils/api";
import { useRouter } from "next/router";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import { Button } from "pergamos/components/UI/Button";
import BrokersTable from "pergamos/components/brokerComponents/BrokersTable";
import BankDetails from "pergamos/components/bankComponents/BankDetails";
import BrokerCreate from "pergamos/components/brokerComponents/BrokerCreate";
import BankAmend from "pergamos/components/bankComponents/BankAmend";
import BankApprove from "pergamos/components/bankComponents/BankAmendApprove";
import BankActivate from "pergamos/components/bankComponents/BankActivate";

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
      Hey
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
