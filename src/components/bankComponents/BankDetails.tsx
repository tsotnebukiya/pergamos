import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import Link from "next/link";
import { type RouterOutputs } from "pergamos/utils/api";
import { ArrowLeftRight, DollarSign } from "lucide-react";

type Bank = RouterOutputs["banks"]["getOne"];

const BankDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
  bank: Bank;
  transactions?: number;
  volume?: number;
}> = ({ cardClass1, cardClass2, bank, transactions, volume }) => {
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant={bank.active ? "outline" : "secondary"}>
                {bank.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Website</span>
              <a
                href={bank.website}
                className="hover:underline"
                target="_blank"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {bank.website}
                </Button>
              </a>
            </div>
            <div className="flex justify-between">
              <span>Created By</span>
              <Link
                href={`/dashboard/users/${bank.makerUser.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {bank.makerUser.name}
                </Button>
              </Link>
            </div>
            {bank.checkerUser?.id && bank.checkerUser.name && (
              <div className="flex justify-between">
                <span>Approved By</span>

                <Link href={`/dashboard/users/${bank.checkerUser.id}`}>
                  <Button variant="link" className="h-10 items-start p-0">
                    {bank.checkerUser.name}
                  </Button>
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
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
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
