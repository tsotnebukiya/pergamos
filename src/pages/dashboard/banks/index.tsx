import type { ReactElement } from "react";

import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/navbar/Breadcrumbs";
import PageHeader from "pergamos/components/UI/PageHeader";
import Grid from "pergamos/components/UI/Grid";
import BanksList from "pergamos/components/bankLayout/BanksList";
import Link from "next/link";
import Button from "pergamos/components/UI/ButtonStyle";
import { api } from "pergamos/utils/api";
import { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";

const BanksListPage: NextPageWithLayout = () => {
  const { data } = api.banks.getAll.useQuery();
  if (!data) return null;
  console.log(data[0]?._count.teams);
  return (
    <main>
      <BreadCrumbs pages={[{ name: "Banks", href: "/dashboard/banks" }]} />
      {/* <PageHeader heading="List of Banks">
          <Link href={`/dashboard/banks/create`}>
            <Button text="Create" />
          </Link>
        </PageHeader> */}
      <Grid>
        <BanksList banks={data} />
      </Grid>
    </main>
  );
};

BanksListPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BanksListPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.banks.getAll.fetch();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
