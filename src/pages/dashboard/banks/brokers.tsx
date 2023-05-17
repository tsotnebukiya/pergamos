import type { ReactElement } from "react";

import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";

const Brokers: NextPageWithLayout = () => {
  return <></>;
};

Brokers.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Brokers;
