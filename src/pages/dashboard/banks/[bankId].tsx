import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import { api } from "pergamos/utils/api";
import { useRouter } from "next/router";
import BankStats from "pergamos/components/bankLayout/BankStats";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import { useSession } from "next-auth/react";
import { Button } from "pergamos/components/UI/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import BrokersTable from "pergamos/components/brokers/BrokersTable";
import BankDetails from "pergamos/components/bankLayout/BankDetails";
import EmptyState from "pergamos/components/UI/EmptyState";
import BankCreate from "pergamos/components/bankLayout/BankCreate";
import BrokerCreate from "pergamos/components/brokers/BrokerCreate";
import BankAmend from "pergamos/components/bankLayout/BankAmend";
import BankApprove from "pergamos/components/bankLayout/BankApprove";

const brokers = [
  {
    id: "5",
    title: "Broker 1",
    accounts: ["903"],
    market: "icsd",
    assignedTeam: {
      name: "ICSD team",
      id: 1,
    },
  },
  {
    id: "2",
    title: "Broker 2",
    accounts: ["2653"],
    market: "us",
    assignedTeam: {
      name: "ICSD team",
      id: 1,
    },
  },
  {
    id: "4",
    title: "Broker 3",
    accounts: ["2412"],
    market: "za",
    assignedTeam: {
      name: "ICSD team",
      id: 1,
    },
  },
  {
    id: "10",
    title: "Broker 10",
    accounts: ["3412", "2312", "3412"],
    market: "uk",
    assignedTeam: {
      name: "ICSD team",
      id: 1,
    },
  },
];

const BrokerOverviewPage: NextPageWithLayout = () => {
  const [openBrokerCreate, setOpenBrokerCreate] = useState(false);
  const [openBankdAmend, setOpenBankAmend] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const query = useRouter().query.bankId as string;
  const { data } = api.banks.getOne.useQuery({ id: Number(query) });
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs pages={[{ name: "Banks", href: "/dashboard/banks" }]} />
      <div className="container mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
          {!data.active ? (
            <Button size="sm">Approve</Button>
          ) : data.amending ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenApprove(true)}
            >
              Pending Changes
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setOpenBankAmend(true);
              }}
            >
              Edit
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <BankDetails
              active={data.active}
              makerId={data.makerUser.id}
              makerName={data.makerUser.name}
              website={data.website}
              approverId={data.checkerUser?.id}
              approverName={data.checkerUser?.name}
              transactions={100}
              volume={100000}
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1 space-y-4"
              cardClass1="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2 "
            />
            {/* <EmptyState
              text="broker"
              cardClass="h-full flex align-center justify-center col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-5 lg:row-span-2 border-none shadow-none"
              action={() => {
                setOpenBrokerCreate(true);
              }}
            /> */}
            <BrokersTable
              bankId={query}
              data={brokers}
              openSheet={() => {
                setOpenBrokerCreate(true);
              }}
              cardClass="col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-5 lg:row-span-2 border-none shadow-none"
            />
          </div>
        </div>
      </div>
      {openBankdAmend && (
        <BankAmend open={openBankdAmend} setOpen={setOpenBankAmend} />
      )}
      {openBrokerCreate && (
        <BrokerCreate open={openBrokerCreate} setOpen={setOpenBrokerCreate} />
      )}
      {data.audits[0] && (
        <BankApprove
          bankId={data.id}
          amendId={data.audits[0].id}
          open={openApprove}
          setOpen={setOpenApprove}
          name={data.audits[0].name}
          website={data.audits[0].website}
        />
      )}
    </main>
  );
};

BrokerOverviewPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BrokerOverviewPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.bankId;
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.banks.getOne.fetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
