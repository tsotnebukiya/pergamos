import { DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import Link from "next/link";
import { type RouterOutputs } from "pergamos/utils/api";
import { Market } from "../UI/Market";
import PaymentAudit from "./paymentAudit";

type Payment = RouterOutputs["payments"]["getOne"];

const PaymentDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
  data: Payment;
}> = ({ cardClass1, cardClass2, data }) => {
  console.log(data);
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant="outline">{data.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Broker</span>
              <Link
                href={`/dashboard/banks/${data.broker.bank}/brokers/${data.broker.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {data.broker.name}
                </Button>
              </Link>
            </div>

            <div className="flex justify-between">
              <span>Associated Team</span>
              <Link href={`/dashboard/teams/${data.citiTeam.id}`}>
                <Button variant="link" className="h-0 items-start p-0">
                  {data.citiTeam.name}
                </Button>
              </Link>
            </div>
            <div className="flex justify-between">
              <span>Maker</span>
              <Link
                href={`dashboard/users/${data.makerUser.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {data.makerUser.name}
                </Button>
              </Link>
            </div>
            {data.checkerUserI && (
              <div className="flex justify-between">
                <span>Checker I</span>

                <Link href={`dashboard/users/${data.checkerUserI.id}`}>
                  <Button variant="link" className="h-10 items-start p-0">
                    {data.checkerUserI.name}
                  </Button>
                </Link>
              </div>
            )}
            {data.checkerUserII && (
              <div className="flex justify-between">
                <span>Checker II</span>

                <Link href={`dashboard/users/${data.checkerUserII.id}`}>
                  <Button variant="link" className="h-10 items-start p-0">
                    {data.checkerUserII.name}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className={`${cardClass2 || ""} border-0`}>
        <PaymentAudit data={data} />
        {/* <CardHeader>
          <CardTitle>SSI Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge
                variant={ssi.status === "APPROVED" ? "outline" : "secondary"}
              >
                {ssi.status === "APPROVED" ? "Approved" : "Pending"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Created By</span>
              <Link
                href={`dashboard/users/${ssi.makerUser.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {ssi.makerUser.name}
                </Button>
              </Link>
            </div>
            {ssi.checkerUser?.id && ssi.checkerUser.name && (
              <div className="flex justify-between">
                <span>Approved By</span>

                <Link href={`dashboard/users/${ssi.checkerUser.id}`}>
                  <Button variant="link" className="h-10 items-start p-0">
                    {ssi.checkerUser.name}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent> */}
      </Card>
    </>
  );
};

export default PaymentDetails;
