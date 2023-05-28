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
import EmptyState from "pergamos/components/UI/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";

const BrokerOverviewPage: NextPageWithLayout = () => {
  const [openBrokerCreate, setOpenBrokerCreate] = useState(false);
  const [openBankdAmend, setOpenBankAmend] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
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
            <Button size="sm" onClick={() => setOpenActivate(true)}>
              Activate
            </Button>
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
              bank={data}
              transactions={100}
              volume={100000}
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1 space-y-4"
              cardClass1="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2 "
            />
            {data.brokers.length > 0 ? (
              <Card className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
                <CardHeader className="px-0">
                  <CardTitle>Brokers</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <BrokersTable
                    data={data.brokers}
                    openSheet={() => {
                      setOpenBrokerCreate(true);
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                text="broker"
                cardClass="h-full flex align-center justify-center col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-5 lg:row-span-2 border-none shadow-none"
                action={() => {
                  setOpenBrokerCreate(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {openBankdAmend && (
        <BankAmend open={openBankdAmend} setOpen={setOpenBankAmend} />
      )}
      {openBrokerCreate && (
        <BrokerCreate
          open={openBrokerCreate}
          setOpen={setOpenBrokerCreate}
          bankId={Number(query)}
        />
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
      {openActivate && (
        <BankActivate
          bankId={data.id}
          open={openActivate}
          setOpen={setOpenActivate}
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
