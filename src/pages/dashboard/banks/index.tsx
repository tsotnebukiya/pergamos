import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import BanksTable from "pergamos/components/bankComponents/BanksTable";
import BankCreate from "pergamos/components/bankComponents/BankCreate";
import Spinner from "pergamos/components/UI/Spinner";

const BanksListPage: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false);
  const { data } = api.banks.getAll.useQuery();
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs pages={[{ name: "Banks", href: "/dashboard/banks" }]} />
      <div className="container mx-auto py-6">
        <BanksTable data={data} openSheet={() => setOpen(true)} />
        {open && <BankCreate open={open} setOpen={setOpen} />}
      </div>
    </main>
  );
};

BanksListPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BanksListPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);

  await helper.banks.getAll.prefetch();

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
