import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import SSITable from "pergamos/components/ssiComponents/ssiTable";
import { useRouter } from "next/router";
import { Button } from "pergamos/components/UI/Button";
import PaymentDetails from "pergamos/components/paymentComponents/paymentDetails";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import { Label } from "pergamos/components/UI/Label";
import { Input } from "pergamos/components/UI/Input";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios, { AxiosResponse } from "axios";
import { PaperclipIcon } from "lucide-react";
import { Separator } from "pergamos/components/UI/Separator";

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
const SSIListPage: NextPageWithLayout = () => {
  const query = useRouter().query.paymentId;
  const { data } = api.payments.getOne.useQuery({ id: Number(query) });
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
      mutate({ id: data?.ssi.assignedFile.s3Id });
    }
  };
  if (!data) return null;
  return (
    <main>
      <BreadCrumbs
        pages={[
          { name: "Payments", href: "/dashboard/payments" },
          { name: `PM-${data.id}`, href: `/dashboard/payments/${data.id}` },
        ]}
      />
      <div className="container mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Payment #{data.id}
          </h2>
          {data.status === "PENDING" ? <Button size="sm">Activate</Button> : ""}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <PaymentDetails
              cardClass1="col-span-1 space-y-4 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1"
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2"
              data={data}
            />

            <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
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
                    <Separator
                      orientation="horizontal"
                      className="col-span-2"
                    />
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

SSIListPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SSIListPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.paymentId;
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.payments.getOne.prefetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
