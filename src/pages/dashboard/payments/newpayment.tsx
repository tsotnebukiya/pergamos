/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  type ReactElement,
  type ChangeEvent,
  useState,
  useEffect,
} from "react";
import { format } from "date-fns";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/Breadcrumbs";
import { RouterOutputs, api } from "pergamos/utils/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "pergamos/components/UI/Card";
import axios from "axios";
import { array, z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "pergamos/components/UI/Form";
import { ComboBox } from "pergamos/components/UI/ComboBox";
import { Button } from "pergamos/components/UI/Button";
import { Input, NumericInput } from "pergamos/components/UI/Input";
import Stepper from "pergamos/components/paymentComponents/Stepper";
import { Separator } from "pergamos/components/UI/Separator";
import { Label } from "pergamos/components/UI/Label";
import { Market } from "pergamos/components/UI/Market";
import { Switch } from "pergamos/components/UI/Switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "pergamos/components/UI/Popover";
import { cn } from "pergamos/utils/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "pergamos/components/UI/Calendar";
import { useRouter } from "next/router";
import { toast } from "pergamos/hooks/useToast";

const numbersArray = Array.from({ length: 93 }, (_, index) => index + 9);

const formSchema = z.object({
  assignedBroker: z
    .string()
    .refine((value) => value !== "", "Please choose Assigned Broker"),
  assignedTeam: z
    .string()
    .refine((value) => value !== "", "Please choose Citi Team"),
  assignedSsi: z.string().refine((value) => value !== "", "Please choose SSI"),
  purpose: z.string().refine((value) => value !== "", "Please choose Purpose"),
  amount: z
    .string()
    .refine((value) => value !== "", "Please enter Amount")
    .refine((value) => {
      const numValue = Number(parseFloat(value.replace(/,/g, "")));
      return !isNaN(numValue) && numValue > 0;
    }, "Please enter correct amount"),
  relatedTrade: z.string(),
  appNotification: z.boolean(),
  emailNotification: z.boolean(),
  valueDate: z.date(),
  receiverInformation: z
    .string()
    .refine((value) => value !== "", "Please choose Receiver Info"),
});

const NewPaymentPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [stepState, setStepState] = useState<{
    step01: "complete" | "current" | "upcoming";
    step02: "complete" | "current" | "upcoming";
  }>({
    step01: "current",
    step02: "upcoming",
  });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      assignedBroker: "",
      assignedTeam: "",
      assignedSsi: "",
      purpose: "",
      amount: "",
      relatedTrade: "",
      emailNotification: false,
      appNotification: false,
      // valueDate: new Date(),
      receiverInformation: "",
    },
  });
  const { mutate } = api.payments.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/dashboard/payments/${data.id}`);
      toast({
        variant: "default",
        title: "Success",
        description: "Payment created successfully",
      });
      setSubmitting(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      setSubmitting(false);
    },
  });
  const { data: teamsData } = api.teams.getAll.useQuery();
  const { data: brokersData } = api.brokers.getAll.useQuery();
  const { data: brokerData } = api.brokers.getOne.useQuery(
    {
      id: Number(form.watch("assignedBroker")),
      ssi: true,
    },
    {
      enabled: !!form.watch("assignedBroker"),
    }
  );
  const { data: ssiData } = api.ssi.getOne.useQuery(
    {
      id: form.watch("assignedSsi"),
    },
    {
      enabled: !!form.watch("assignedSsi"),
    }
  );
  const brokersArr = brokersData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const teamsArr = teamsData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const ssisArr = brokerData?.ssis?.map((el) => ({
    value: el.id,
    label: el.name,
  }));
  const enabled01 =
    !!form.watch("assignedTeam") &&
    !!form.watch("assignedBroker") &&
    !!form.watch("purpose") &&
    !!brokerData;
  const enabled02 =
    !!form.watch("assignedSsi") &&
    !!form.watch("amount") &&
    !!form.watch("valueDate") &&
    !!form.watch("receiverInformation");
  const goNextToSecondStep = () => {
    setStepState({
      step01: "complete",
      step02: "current",
    });
  };
  const goToFirstStep = () => {
    setStepState({
      step01: "current",
      step02: "upcoming",
    });
  };
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    mutate({
      ...data,
      assignedTeam: Number(data.assignedTeam),
      assignedBroker: Number(data.assignedBroker),
      amount: Number(parseFloat(data.amount.replace(/,/g, ""))),
    });
  };
  return (
    <main>
      <BreadCrumbs pages={[{ name: "SSI", href: "/dashboard/ssi" }]} />
      <div className="container mx-auto flex flex-col gap-8 py-6">
        <Stepper status01={stepState.step01} status02={stepState.step02} />
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div
                  className={`flex flex-col gap-4 ${
                    stepState.step01 !== "current" ? "hidden" : ""
                  }`}
                >
                  <div className="grid grid-cols-2 gap-y-6">
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
                      name="assignedBroker"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Assigned Broker *</FormLabel>
                          <ComboBox
                            fieldValue={field.value}
                            array={brokersArr}
                            name="broker"
                            onSelect={(value) => {
                              form.setValue("assignedBroker", value);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator
                      orientation="horizontal"
                      className="col-span-2"
                    />
                    {brokerData && (
                      <>
                        <div className="flex flex-col gap-4">
                          <Label>Market</Label>
                          <div className="flex h-10 w-full max-w-[200px] cursor-default rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ">
                            <Market market={brokerData.market} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <Label>Account</Label>
                          <Input
                            value={brokerData.accounts.map(
                              (acc, index) =>
                                `${index > 0 ? " | " : ""}${acc.account}`
                            )}
                            className="max-w-[200px] cursor-default focus-visible:ring-0"
                            readOnly
                          />
                        </div>
                        <Separator
                          orientation="horizontal"
                          className="col-span-2"
                        />
                      </>
                    )}
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Payment Purpose *</FormLabel>
                          <ComboBox
                            fieldValue={field.value}
                            array={[
                              { value: "CLAIM", label: "Claim" },
                              { value: "LENDING", label: "Lending" },
                              { value: "TAX", label: "Tax" },
                              { value: "OTHER", label: "Other" },
                            ]}
                            name="purpose"
                            onSelect={(value) =>
                              form.setValue("purpose", value)
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relatedTrade"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Related Trade</FormLabel>
                          <ComboBox
                            fieldValue={field.value}
                            array={[
                              { value: "5689386574", label: "5689386574" },
                              { value: "5689386575", label: "5689386575" },
                              { value: "5689386576", label: "5689386576" },
                              { value: "5689386577", label: "5689386577" },
                            ]}
                            name="trade"
                            onSelect={(value) =>
                              form.setValue("relatedTrade", value)
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator
                      orientation="horizontal"
                      className="col-span-2"
                    />

                    <FormField
                      control={form.control}
                      name="appNotification"
                      render={({ field }) => (
                        <FormItem className="span col-span-2 flex w-1/2 flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              App Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive app notifications related to this payment.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotification"
                      render={({ field }) => (
                        <FormItem className="span col-span-2 flex w-1/2 flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive email notifications related to this
                              payment.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button
                      type="button"
                      className="ml-auto"
                      disabled={!enabled01}
                      onClick={() => {
                        goNextToSecondStep();
                      }}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
                <div
                  className={`flex flex-col gap-4 ${
                    stepState.step02 !== "current" ? "hidden" : ""
                  }`}
                >
                  <div className="grid grid-cols-2 gap-y-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount *</FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="Amount"
                              {...field}
                              className="max-w-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Value Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                // disabled={(date) =>
                                //   date > new Date() ||
                                //   date < new Date("1900-01-01")
                                // }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator
                      orientation="horizontal"
                      className="col-span-2"
                    />
                    <FormField
                      control={form.control}
                      name="receiverInformation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receiver Info *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Text"
                              {...field}
                              className="max-w-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignedSsi"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>SSI *</FormLabel>
                          <ComboBox
                            fieldValue={field.value}
                            array={ssisArr}
                            name="SSI"
                            onSelect={(value) => {
                              form.setValue("assignedSsi", value);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator
                      orientation="horizontal"
                      className="col-span-2"
                    />
                    {ssiData && (
                      <>
                        <div className="flex flex-col gap-4">
                          <Label>Currency</Label>
                          <div className="flex h-10 w-full max-w-[200px] cursor-default rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ">
                            <span>{ssiData.currency.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          {ssiData.field56Institution && (
                            <>
                              <Label>Field 56 Institution</Label>
                              <Input
                                value={ssiData.field56Institution}
                                className="max-w-[200px] cursor-default focus-visible:ring-0"
                                readOnly
                              />
                            </>
                          )}
                        </div>
                        <Separator
                          orientation="horizontal"
                          className="col-span-2"
                        />
                        <div className="flex flex-col gap-4">
                          <Label>Field 57 Institution</Label>
                          <Input
                            value={ssiData.field57Institution}
                            className="max-w-[200px] cursor-default focus-visible:ring-0"
                            readOnly
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <Label>Account</Label>
                          <Input
                            value={ssiData.field57Account}
                            className="max-w-[200px] cursor-default focus-visible:ring-0"
                            readOnly
                          />
                        </div>
                        {ssiData.field58Account &&
                          ssiData.field58Institution && (
                            <>
                              <Separator
                                orientation="horizontal"
                                className="col-span-2"
                              />
                              <div className="flex flex-col gap-4">
                                <Label>Field 58 Institution</Label>
                                <Input
                                  value={ssiData.field58Institution}
                                  className="max-w-[200px] cursor-default focus-visible:ring-0"
                                  readOnly
                                />
                              </div>
                              <div className="flex flex-col gap-4">
                                <Label>Account</Label>
                                <Input
                                  value={ssiData.field58Account}
                                  className="max-w-[200px] cursor-default focus-visible:ring-0"
                                  readOnly
                                />
                              </div>
                            </>
                          )}
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button
                      type="button"
                      className="mr-auto"
                      disabled={submitting}
                      onClick={() => {
                        goToFirstStep();
                      }}
                    >
                      Previous Step
                    </Button>
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={submitting || !enabled02 || !ssiData}
                    >
                      {submitting ? <>Submitting...</> : <>Submit</>}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

NewPaymentPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default NewPaymentPage;
