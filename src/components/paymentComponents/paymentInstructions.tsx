import { RouterOutputs, api } from "pergamos/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Label } from "../UI/Label";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { useState } from "react";
import { AxiosResponse } from "axios";
import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PaperclipIcon } from "lucide-react";

type Payment = RouterOutputs["payments"]["getOne"];

const downloadFile = async (url: string, filename: string) => {
  try {
    const res: AxiosResponse<Blob> = await axios.get(url, {
      responseType: "blob",
    });
    const downloadUrl = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();
    return;
  } catch (err) {
    console.log(err);
  }
};

const PaymentInstructions: React.FC<{ data: Payment }> = ({ data }) => {
  const [downloading, setDownloading] = useState(false);
  const { mutate } = api.ssi.downloadFile.useMutation({
    onSuccess: async (data) => {
      await downloadFile(data.url, data.filename);
      setDownloading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const downloadHandler = () => {
    setDownloading(true);
    if (data?.ssi.assignedFile.name) {
      mutate({ id: data?.ssi.assignedFile.name });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>SSI Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="col-span-2">
            {data.ssi.field56Institution && (
              <div className="flex flex-col gap-4">
                <Label>Field 56/ Intermediary Institution</Label>
                <Input
                  value={data.ssi.field56Institution}
                  className="max-w-[300px] cursor-default focus-visible:ring-0"
                  readOnly
                />
              </div>
            )}
          </div>
          {data.ssi.field57Institution && (
            <div className="flex flex-col gap-4">
              <Label>Field 57/Instituion</Label>
              <Input
                value={data.ssi.field57Institution}
                className="max-w-[300px] cursor-default focus-visible:ring-0"
                readOnly
              />
            </div>
          )}
          {data.ssi.field57Account && (
            <div className="flex flex-col gap-4">
              <Label>Account</Label>
              <Input
                value={data.ssi.field57Account}
                className="max-w-[300px] cursor-default focus-visible:ring-0"
                readOnly
              />
            </div>
          )}

          {data.ssi.field58Institution && (
            <div className="flex flex-col gap-4">
              <Label>Field 58/Beneficiary Institution</Label>
              <Input
                value={data.ssi.field58Institution}
                className="max-w-[300px] cursor-default focus-visible:ring-0"
                readOnly
              />
            </div>
          )}
          {data.ssi.field58Account && (
            <div className="flex flex-col gap-4">
              <Label>Beneficiary Account</Label>
              <Input
                value={data.ssi.field58Account}
                className="max-w-[300px] cursor-default focus-visible:ring-0"
                readOnly
              />
            </div>
          )}

          <div className="col-span-2">
            {data.ssi.furtherCreditTo && (
              <div className="flex flex-col gap-4">
                <Label>For the Account Of/FAO</Label>
                <Input
                  value={data.ssi.furtherCreditTo}
                  className="max-w-[300px] cursor-default focus-visible:ring-0"
                  readOnly
                />
              </div>
            )}
          </div>
          {data.ssi.assignedFile.name && (
            <div className="flex flex-col items-start  gap-4 ">
              <Label>Backup</Label>
              <Button
                variant="ghost"
                className="m-0 flex gap-1 px-0 hover:bg-inherit"
                disabled={downloading}
                onClick={() => {
                  downloadHandler();
                }}
              >
                {downloading && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span>Downloading</span>
                  </>
                )}
                {!downloading && (
                  <>
                    <PaperclipIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{data.ssi.assignedFile.name}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInstructions;
