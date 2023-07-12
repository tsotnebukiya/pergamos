import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { Button } from "pergamos/components/UI/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import { Input } from "pergamos/components/UI/Input";
import { Label } from "pergamos/components/UI/Label";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import SSIDetails from "pergamos/components/ssiComponents/ssiDetails";
import { api } from "pergamos/utils/api";
import { createHelpers } from "pergamos/utils/helpers";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { NextPageWithLayout } from "pergamos/utils/types";
import { ReactElement, useState } from "react";
import SSIActivate from "pergamos/components/ssiComponents/ssiActivate";
import axios, { AxiosResponse } from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";

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

const SSIPage: NextPageWithLayout = () => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const query = useRouter().query.ssiId as string;
  const { data } = api.ssi.getOne.useQuery({ id: query });
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
    if (data?.assignedFile.name) {
      mutate({ id: data?.assignedFile.name });
    }
  };
  if (!data) return null;
  return (
    <>
      <BreadCrumbs pages={[{ name: "Banks", href: "/dashboard/banks" }]} />
      <div className="container mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
          {data.status === "PENDING" ? (
            <Button
              size="sm"
              onClick={() => {
                setApproveOpen(true);
              }}
            >
              Activate
            </Button>
          ) : (
            ""
          )}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <SSIDetails
              cardClass1="col-span-1 space-y-4 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1"
              cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2"
              ssi={data}
            />

            <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>SSI Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="col-span-2">
                      {data.field56Institution && (
                        <div className="flex flex-col gap-4">
                          <Label>Field 56/ Intermediary Institution</Label>
                          <Input
                            value={data.field56Institution}
                            className="max-w-[300px] cursor-default focus-visible:ring-0"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    {data.field57Institution && (
                      <div className="flex flex-col gap-4">
                        <Label>Field 57/Instituion</Label>
                        <Input
                          value={data.field57Institution}
                          className="max-w-[300px] cursor-default focus-visible:ring-0"
                          readOnly
                        />
                      </div>
                    )}
                    {data.field57Account && (
                      <div className="flex flex-col gap-4">
                        <Label>Account</Label>
                        <Input
                          value={data.field57Account}
                          className="max-w-[300px] cursor-default focus-visible:ring-0"
                          readOnly
                        />
                      </div>
                    )}

                    {data.field58Institution && (
                      <div className="flex flex-col gap-4">
                        <Label>Field 58/Beneficiary Institution</Label>
                        <Input
                          value={data.field58Institution}
                          className="max-w-[300px] cursor-default focus-visible:ring-0"
                          readOnly
                        />
                      </div>
                    )}
                    {data.field58Account && (
                      <div className="flex flex-col gap-4">
                        <Label>Beneficiary Account</Label>
                        <Input
                          value={data.field58Account}
                          className="max-w-[300px] cursor-default focus-visible:ring-0"
                          readOnly
                        />
                      </div>
                    )}

                    <div className="col-span-2">
                      {data.furtherCreditTo && (
                        <div className="flex flex-col gap-4">
                          <Label>For the Account Of/FAO</Label>
                          <Input
                            value={data.furtherCreditTo}
                            className="max-w-[300px] cursor-default focus-visible:ring-0"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    {data.assignedFile.name && (
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
                              <PaperClipIcon
                                className="h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span>{data.assignedFile.name}</span>
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
      {approveOpen && (
        <SSIActivate
          open={approveOpen}
          setOpen={setApproveOpen}
          ssiId={query}
        />
      )}
    </>
  );
};

SSIPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SSIPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.ssiId;
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.ssi.getOne.fetch({ id: id });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
