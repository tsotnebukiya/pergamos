import { DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Button } from "../UI/Button";
import Link from "next/link";
import { type RouterOutputs } from "pergamos/utils/api";
import { Market } from "../UI/Market";

type SSI = RouterOutputs["ssi"]["getOne"];

const SSIDetails: React.FC<{
  cardClass1?: string;
  cardClass2?: string;
  ssi: SSI;
}> = ({ cardClass1, cardClass2, ssi }) => {
  return (
    <>
      <Card className={cardClass1}>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Currency</span>
              <span>{ssi.currency.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Broker</span>
              <Link
                href={`/dashboard/banks/${ssi.brokerId.id}`}
                className="items-start"
              >
                <Button variant="link" className="h-0 items-start p-0">
                  {ssi.brokerId.name}
                </Button>
              </Link>
            </div>

            <div className="flex justify-between">
              <span>Associated Team</span>
              <Link href={`/dashboard/users/${ssi.citiTeam.id}`}>
                <Button variant="link" className="h-10 items-start p-0">
                  {ssi.citiTeam.name}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={cardClass2}>
        <CardHeader>
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
        </CardContent>
      </Card>
    </>
  );
};

export default SSIDetails;
