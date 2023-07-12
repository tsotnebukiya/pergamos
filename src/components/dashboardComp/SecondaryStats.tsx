import { RouterOutputs } from "pergamos/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../UI/Card";
import PendingTable from "./PendingTable";
import PaymentAudit from "../paymentComponents/paymentAudit";

type Payment = RouterOutputs["payments"]["dashboard"]["secondaryStats"];

const SecondaryStats: React.FC<{ data: Payment }> = ({ data }) => {
  return (
    <div className="grid h-[400px] gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingTable data={data.pendingPayments} />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Latest Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentAudit data={data.audit} dashboard={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SecondaryStats;
