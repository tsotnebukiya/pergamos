/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { Sheet, SheetContent, SheetTitle } from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/Form";
import { marketsArr } from "../UI/Market";
import { ComboBox } from "../UI/ComboBox";
import { cn } from "pergamos/utils/utils";
import { useRouter } from "next/router";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  market: z.string().nonempty("Market is required"),
  assignedTeam: z.string().nonempty("Assigned Team is required"),
  bankId: z.string(),
  accounts: z.array(
    z.object({
      value: z
        .string()
        .refine((value) => value !== "", "Please enter Account")
        .refine((value) => {
          const numValue = Number(value);
          return !isNaN(numValue) && numValue > 0 && Number.isInteger(numValue);
        }, "Account must be a number"),
    })
  ),
});

const BrokerCreate: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  bankId?: number;
}> = ({ open, setOpen, bankId }) => {
  const router = useRouter();
  const { data: teamsData } = api.teams.getAll.useQuery();
  const { data: banksData } = api.banks.getAll.useQuery();
  const teamsArr = teamsData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const banksArr = banksData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      accounts: [{ value: "" }],
      assignedTeam: "",
      market: "",
      name: "",
      bankId: "",
    },
  });
  const { mutate } = api.brokers.create.useMutation({
    onSuccess: async (data) => {
      setSubmitting(false);
      setOpen(false);
      await router.push(
        `/dashboard/banks/${
          bankId ? bankId : form.getValues().bankId
        }/brokers/${data.id}`
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Broker created successfully",
      });
    },
    onError: (error) => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "accounts",
    control: form.control,
  });
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    mutate({
      ...data,
      bankId: bankId ? bankId : Number(data.bankId),
      assignedTeam: Number(data.assignedTeam),
      accounts: data.accounts.map((el) => el.value),
    });
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        setOpen(val);
      }}
      open={open}
    >
      <SheetContent size={"sm"} onInteractOutside={() => setOpen(false)}>
        <SheetTitle className="py-6">Add broker</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker Name</FormLabel>
                  <FormDescription>Name of the Broker team.</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="max-w-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!bankId && (
              <FormField
                control={form.control}
                name="bankId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assigned Bank</FormLabel>
                    <FormDescription>Choose associated Bank</FormDescription>
                    <ComboBox
                      fieldValue={field.value}
                      array={banksArr}
                      name="team"
                      onSelect={(value) => form.setValue("bankId", value)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Market</FormLabel>
                  <FormDescription>
                    Choose market handled by Broker
                  </FormDescription>
                  <ComboBox
                    fieldValue={field.value}
                    array={marketsArr}
                    name="market"
                    onSelect={(value) => form.setValue("market", value)}
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
                  <FormLabel>Assigned Team</FormLabel>
                  <FormDescription>
                    Choose Citi Team interacting with Broker
                  </FormDescription>
                  <ComboBox
                    fieldValue={field.value}
                    array={teamsArr}
                    name="team"
                    onSelect={(value) => form.setValue("assignedTeam", value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`accounts.${index}`}
                  render={() => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Accounts
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add accounts handled by Broker.
                      </FormDescription>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...form.register(`accounts.${index}.value`)}
                            className="w-[200px]"
                          />
                          {index !== 0 && (
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => append({ value: "" })}
              >
                Add Account
              </Button>
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onMouseDown={() => setOpen(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default BrokerCreate;
