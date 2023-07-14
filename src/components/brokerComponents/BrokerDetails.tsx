import { DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import Link from "next/link";
import { type RouterOutputs } from "pergamos/utils/api";
import { Market } from "../UI/Market";

type Broker = RouterOutputs["brokers"]["getOne"];

const BrokerDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
  broker: Broker;
}> = ({ cardClass1, cardClass2, broker }) => {
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Market</span>
              <Market market={broker.market} />
            </div>
            <div className="flex justify-between">
              <span>Bank</span>
              <Link
                href={`/dashboard/banks/${broker.bankId.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {broker.bankId.name}
                </Button>
              </Link>
            </div>

            <div className="flex justify-between">
              <span>Associated Team</span>
              <Link href={`/dashboard/teams/${broker.citiTeam.id}`}>
                <Button variant="link" className="h-10 items-start p-0">
                  {broker.citiTeam.name}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={cardClass2}>
        <CardHeader>
          <CardTitle>Broker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant={broker.active ? "outline" : "secondary"}>
                {broker.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Created By</span>
              <Link
                href={`/dashboard/users/${broker.makerUser.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {broker.makerUser.name}
                </Button>
              </Link>
            </div>
            {broker.checkerUser?.id && broker.checkerUser.name && (
              <div className="flex justify-between">
                <span>Approved By</span>

                <Link href={`/dashboard/users/${broker.checkerUser.id}`}>
                  <Button variant="link" className="h-10 items-start p-0">
                    {broker.checkerUser.name}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BrokerDetails;
