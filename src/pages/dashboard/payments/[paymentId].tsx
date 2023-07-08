import { type ReactElement } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import { useRouter } from "next/router";
import { Button } from "pergamos/components/UI/Button";
import PaymentDetails from "pergamos/components/paymentComponents/paymentDetails";
import { Tabs } from "pergamos/components/UI/Tabs";
import { TabsList } from "pergamos/components/UI/Tabs";
import { TabsTrigger } from "pergamos/components/UI/Tabs";
import { TabsContent } from "pergamos/components/UI/Tabs";
import PaymentGeneral from "pergamos/components/paymentComponents/paymentGeneral";
import PaymentInstructions from "pergamos/components/paymentComponents/paymentInstructions";

const SSIListPage: NextPageWithLayout = () => {
  const query = useRouter().query.paymentId;
  const { data } = api.payments.getOne.useQuery({ id: Number(query) });
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs
        pages={[
          { name: "Payments", href: "/dashboard/payments" },
          { name: `PM-${data.id}`, href: `/dashboard/payments/${data.id}` },
        ]}
      />
      <div className="container mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Payment #{data.id}
          </h2>
          {data.status === "PENDING" ? <Button size="sm">Activate</Button> : ""}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <PaymentDetails
              cardClass1="col-span-1 space-y-4 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1"
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2"
              data={data}
            />

            <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4 mt-6">
                  <TabsTrigger value="overview">Payment</TabsTrigger>
                  <TabsTrigger value="related">Instructions</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <PaymentGeneral data={data} />
                </TabsContent>
                <TabsContent value="related">
                  <PaymentInstructions data={data} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
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
  const id = context.params?.paymentId;
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.payments.getOne.prefetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
