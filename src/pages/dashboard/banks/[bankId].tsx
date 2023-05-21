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
import BrokersTable from "pergamos/components/bankLayout/BrokersTable";
import BankDetails from "pergamos/components/bankLayout/BankDetails";

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
  const session = useSession();
  console.log(session.data?.user.id);
  const query = useRouter().query.bankId as string;
  const [openActivate, setOpenActivate] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const { data } = api.banks.getOne.useQuery({ id: Number(query) });
  const ctx = api.useContext();
  const { mutate: mutateBank } = api.banks.activate.useMutation({
    onSuccess: () => {
      void ctx.banks.getOne.invalidate({ id: Number(query) });
      // toast.custom((t) => <Notify t={t} type="success" />);
    },
    onError: (err) => {
      // toast.custom((t) => <Notify t={t} type="error" text={err.message} />);
    },
  });
  const { mutate: mutateCheck } = api.banks.amendChecker.useMutation({
    onSettled: () => {
      setOpenApprove(false);
    },
    onSuccess: () => {
      void ctx.banks.getOne.invalidate({ id: Number(query) });
      // toast.custom((t) => <Notify t={t} type="success" />);
    },
    onError: (err) => {
      // toast.custom((t) => <Notify t={t} type="error" text={err.message} />);
    },
  });
  const activateHandler = () => {
    mutateBank({ id: Number(query) });
    setOpenActivate(false);
  };
  const approveHandler = () => {
    if (data?.audits[0]?.id) {
      mutateCheck({
        action: "APPROVE",
        amendId: data?.audits[0]?.id,
        bankId: Number(query),
      });
    }
  };
  const rejectHandler = () => {
    if (data?.audits[0]?.id) {
      mutateCheck({
        action: "REJECT",
        amendId: data?.audits[0]?.id,
        bankId: Number(query),
      });
    }
  };
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
            <Button size="sm" variant="outline">
              Pending Changes
            </Button>
          ) : (
            <Button size="sm">Edit</Button>
          )}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2  gap-4 lg:grid-cols-4">
            <BankStats />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <BankDetails
              cardClass1="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1"
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2"
            />
            <BrokersTable
              bankId={query}
              data={brokers}
              cardClass="col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-5 lg:row-span-2 border-none shadow-none"
            />
          </div>
        </div>
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
