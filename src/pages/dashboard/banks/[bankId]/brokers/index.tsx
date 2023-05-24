import type { ReactElement } from "react";

import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";

const BrokersOfBank: NextPageWithLayout = () => {
  return <></>;
};

BrokersOfBank.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BrokersOfBank;
