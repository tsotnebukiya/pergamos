import { RouterOutputs } from "pergamos/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Label } from "../UI/Label";
import { Input } from "../UI/Input";

type Payment = RouterOutputs["payments"]["getOne"];

const PaymentGeneral: React.FC<{ data: Payment }> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex flex-col gap-4">
            <Label>Amount</Label>
            <Input
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: `${data.ssi.currency.toUpperCase()}`,
              }).format(data.amount)}
              className="max-w-[300px] cursor-default focus-visible:ring-0"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Value Date</Label>
            <Input
              value={data.valueDate.toDateString()}
              className="max-w-[300px] cursor-default focus-visible:ring-0"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Type</Label>
            <Input
              value={data.purpose.toUpperCase()}
              className="max-w-[300px] cursor-default focus-visible:ring-0"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Receiver Info</Label>
            <Input
              value={data.receiverInformation}
              className="max-w-[300px] cursor-default focus-visible:ring-0"
              readOnly
            />
          </div>
          <div className="col-span-2 flex flex-col gap-4">
            {data.relatedTrade && (
              <>
                <Label>Related Trade</Label>
                <Input
                  value={data.relatedTrade}
                  className="max-w-[300px] cursor-default focus-visible:ring-0"
                  readOnly
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGeneral;
