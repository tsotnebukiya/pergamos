import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import Link from "next/link";

const BankDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
  active: boolean;
  makerName: string;
  makerId: string;
  approverName?: string;
  approverId?: string;
  transactions?: number;
  website: string;
  volume?: number;
}> = ({
  cardClass1,
  cardClass2,
  active,
  makerId,
  makerName,
  website,
  approverId,
  approverName,
  transactions,
  volume,
}) => {
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant={active ? "outline" : "secondary"}>
                {active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Website</span>
              <a href={website} className="hover:underline" target="_blank">
                {website}
              </a>
            </div>
            <div className="flex justify-between">
              <span>Created By</span>
              <Link href={`dashboard/users/${makerId}`}>
                <Button variant="link">{makerName}</Button>
              </Link>
            </div>
            {approverId && approverName && (
              <div className="flex justify-between">
                <span>Approved By</span>

                <Link href={`dashboard/users/${approverId}`}>
                  <Button variant="link">{approverName}</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className={cardClass2}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payments Volume
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {volume ? (
              <div className="text-2xl font-bold">
                {volume.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </div>
            ) : (
              <span>No payments</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactions ? (
              <div className="text-2xl font-bold">{transactions}</div>
            ) : (
              <span>No transactions</span>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BankDetails;
