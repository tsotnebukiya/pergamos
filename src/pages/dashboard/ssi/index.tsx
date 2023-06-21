/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  type ReactElement,
  EventHandler,
  ChangeEventHandler,
  ChangeEvent,
  useState,
} from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { api } from "pergamos/utils/api";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";
import BrokersTable from "pergamos/components/brokerComponents/BrokersTable";
import BrokerCreate from "pergamos/components/brokerComponents/BrokerCreate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import axios from "axios";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "pergamos/components/UI/Form";
import { ComboBox } from "pergamos/components/UI/ComboBox";
import { Button } from "pergamos/components/UI/Button";
import { Input } from "pergamos/components/UI/Input";
import { Label } from "pergamos/components/UI/Label";
import { toast } from "pergamos/hooks/useToast";
import { currencies } from "pergamos/utils/markets";
import { useRouter } from "next/router";
interface UploadData {
  url: string;
}
const uploadfile = async (url: string, file: File) => {
  try {
    const res = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    return res;
  } catch (err) {
    return err;
  }
};

const formSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters long"),
  currency: z.string().min(3, "Must be at least 3 characters long"),
  field56Institution: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  field57Institution: z.string().min(3, "Must be at least 3 characters long"),
  field57Account: z.string().min(3, "Must be at least 3 characters long"),
  field58Institution: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  field58Account: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  furtherCreditTo: z
    .string()
    .min(3, "Must be at least 3 characters long")
    .or(z.literal("")),
  assignedBroker: z.string().nonempty("Choose a broker"),
  assignedTeam: z.string().nonempty("Choose a team"),
  backup: z
    .object({
      type: z.string().min(3, "Upload a file"),
      name: z.string().min(3, "Upload a file"),
    })
    .refine((data) => (data.name && data.type) || (!data.name && !data.type), {
      message:
        "Either provide both backup.name and backup.type, or leave both empty",
    }),
});

const SSIPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);
  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]?.type && e.target.files[0]?.name) {
      setFile(e.target.files[0]);
      form.setValue("backup.name", e.target.files[0]?.name);
      form.setValue("backup.type", e.target.files[0]?.type);
    }
  };
  const { mutate: getSignedUrl } = api.ssi.uploadFile.useMutation({
    onSuccess: async (data) => {
      if (file) {
        const uploadedFile = (await uploadfile(data, file)) as {
          status: string;
          headers: { etag: string };
        };
        mutate({
          ...form.getValues(),
          backupTag: uploadedFile.headers.etag.replace(/"/g, ""),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload File",
        });
      }
    },
    onError: (error) => {
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const { mutate } = api.ssi.createOne.useMutation({
    onSuccess: async (data) => {
      setSubmitting(false);
      toast({
        variant: "default",
        title: "Success",
        description: "SSI created successfully",
      });
      await router.push(`/dashboard/ssi/${data.id}`);
    },
    onError: (error) => {
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const { data: teamsData } = api.teams.getAll.useQuery();
  const { data: brokersData } = api.brokers.getAll.useQuery();
  const brokersArr = brokersData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const teamsArr = teamsData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      currency: "",
      field56Institution: "",
      field57Institution: "",
      field57Account: "",
      field58Institution: "",
      field58Account: "",
      furtherCreditTo: "",
      assignedBroker: "",
      assignedTeam: "",
      backup: {
        type: "",
        name: "",
      },
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    getSignedUrl({
      name: data.backup.name,
      type: data.backup.type,
    });
    // mutate(data);
  };
  return (
    <main>
      <BreadCrumbs pages={[{ name: "SSI", href: "/dashboard/ssi" }]} />
      <div className="container mx-auto flex flex-col gap-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>SSI Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SSI Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="JP USD 24823"
                            {...field}
                            className="max-w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Curreny *</FormLabel>
                        <ComboBox
                          fieldValue={field.value}
                          array={currencies}
                          name="currency"
                          onSelect={(value) => form.setValue("currency", value)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="field56Institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Field 56/ Intermediary Institution
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="IRVTUS3N"
                              {...field}
                              className="max-w-[300px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="field57Institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field 57/Instituion *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="BIMEMXMM"
                            {...field}
                            className="max-w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="field57Account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="4056388655"
                            {...field}
                            className="max-w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="field58Institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field 58/Beneficiary Institution </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MGTCBEBE"
                            {...field}
                            className="max-w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="field58Institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Account </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="95724"
                            {...field}
                            className="max-w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="furtherCreditTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>For the Account Of/FAO </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MLILGB3LDEB"
                              {...field}
                              className="max-w-[300px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="assignedBroker"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Assigned Broker *</FormLabel>
                        <ComboBox
                          fieldValue={field.value}
                          array={brokersArr}
                          name="team"
                          onSelect={(value) =>
                            form.setValue("assignedBroker", value)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignedTeam"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Citi Team *</FormLabel>
                        <ComboBox
                          fieldValue={field.value}
                          array={teamsArr}
                          name="team"
                          onSelect={(value) =>
                            form.setValue("assignedTeam", value)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="backup.name"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Backup *</FormLabel>
                        <Input
                          id="picture"
                          type="file"
                          onChange={(e) => void selectFile(e)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* <p>Select file</p>
        <input type="file" onChange={(e) => void selectFile(e)} /> */}
      </div>
    </main>
  );
};

SSIPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SSIPage;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const helper = await createHelpers(context);

//   await helper.brokers.getAll.prefetch();

//   return {
//     props: {
//       trpcState: helper.dehydrate(),
//     },
//   };
// };
