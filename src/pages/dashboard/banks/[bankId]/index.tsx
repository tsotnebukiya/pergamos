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
import PageHeader from "pergamos/components/UI/PageHeader";
import Link from "next/link";
import Button from "pergamos/components/UI/ButtonStyle";
import Grid from "pergamos/components/UI/Grid";
import type { GetServerSideProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "pergamos/server/api/root";
import Modal from "pergamos/components/overlays/Modal";
import { toast } from "react-hot-toast";
import Notify from "pergamos/components/overlays/Toast";
import { createHelpers } from "pergamos/utils/helpers";
import { useSession } from "next-auth/react";

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
      toast.custom((t) => <Notify t={t} type="success" />);
    },
    onError: (err) => {
      toast.custom((t) => <Notify t={t} type="error" text={err.message} />);
    },
  });
  const { mutate: mutateCheck } = api.banks.amendChecker.useMutation({
    onSettled: () => {
      setOpenApprove(false);
    },
    onSuccess: () => {
      void ctx.banks.getOne.invalidate({ id: Number(query) });
      toast.custom((t) => <Notify t={t} type="success" />);
    },
    onError: (err) => {
      toast.custom((t) => <Notify t={t} type="error" text={err.message} />);
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
      <BreadCrumbs
        pages={[
          { name: "Banks", href: "/dashboard/banks" },
          { name: data.name, href: `/dashboard/banks/${query}` },
        ]}
      />
      <PageHeader
        heading={data.name}
        image={
          data.image
            ? data.image
            : "https://tailwindui.com/img/logos/48x48/tuple.svg"
        }
      >
        {!data.active ? (
          <button onClick={() => setOpenActivate(true)}>
            <Button text="Activate" />
          </button>
        ) : data.amending ? (
          <button onClick={() => setOpenApprove(true)}>
            <Button text="Pending Changes" type="secondary" />
          </button>
        ) : (
          <Link href={`/dashboard/banks/${query}/edit`}>
            <Button text="Edit" />
          </Link>
        )}
      </PageHeader>
      <Grid>
        {bankDetails.transactions === 0 || bankDetails.volume === 0 ? null : (
          <BankStats
            transactions={bankDetails.transactions}
            volume={bankDetails.volume}
            bankId={"2"}
          />
        )}

        <BankDetails {...data} />
        <BankTeams teams={bankDetails.teams} bankId={query} />
      </Grid>
      <Modal
        actionText="Activate"
        type="green"
        heading="Activate Bank"
        text={["Are you sure you want to activate this bank?"]}
        open={openActivate}
        setOpen={setOpenActivate}
        action={activateHandler}
      />
      <Modal
        actionText="Approve"
        type="green"
        heading="Amended Fields"
        text={[
          ...(data.audits[0]?.name ? [`Name: ${data.audits[0].name}`] : []),
          ...(data.audits[0]?.website
            ? [`Website: ${data.audits[0].website}`]
            : []),
        ]}
        deactivationText="Reject"
        deactivationAction={rejectHandler}
        open={openApprove}
        setOpen={setOpenApprove}
        action={approveHandler}
      />
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
