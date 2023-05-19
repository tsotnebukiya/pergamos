import { ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import { prisma } from "pergamos/server/db";
import superjson from "superjson";
import { api } from "pergamos/utils/api";
import { getServerAuthSession } from "pergamos/server/auth";
import BankDetails from "pergamos/components/bankLayout/BankDetails";
import BankTeams from "pergamos/components/bankLayout/BankTeams";
import { useRouter } from "next/router";
import BankStats from "pergamos/components/bankLayout/BankStats";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "pergamos/server/api/root";
import { toast } from "react-hot-toast";
import { createHelpers } from "pergamos/utils/helpers";
import { useSession } from "next-auth/react";
import { Button } from "pergamos/components/UI/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

const bankDetails = {
  name: "Bank of America",
  website: "bankofamerica.com",
  active: true,
  maker: "1",
  makerName: "Jane Doe",
  checkerName: "Steven Livingston",
  checker: "2",
  image: "",
  id: 3512312,
  volume: 5045293,
  transactions: 16,
  teams: [
    {
      teamId: "1",
      name: "JP Receivables 24833",
      assignedTeam: "ICSD Income",
      accounts: [
        {
          account: "24833",
          market: "ICSD",
        },
        {
          account: "51243",
          market: "ICSD",
        },
      ],
    },
    {
      teamId: "2",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
    {
      teamId: "3",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
    {
      teamId: "4",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
    {
      teamId: "5",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
    {
      teamId: "6",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
    {
      teamId: "7",
      name: "JP Receivables 00431",
      assignedTeam: "US Income",
      accounts: [
        {
          account: "00431",
          market: "US",
        },
        {
          account: "91240",
          market: "US",
        },
      ],
    },
  ],
};

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
          <h2 className="text-3xl font-bold tracking-tight">Bank Name</h2>
          <Button size="sm">Approve</Button>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Brokers</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">{/* <Overview /> */}</CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
                {/* <CardDescription>
                      You made 265 sales this month.
                    </CardDescription> */}
              </CardHeader>
              <CardContent>{/* <RecentSales /> */}</CardContent>
            </Card>
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
